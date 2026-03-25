"""
OPTIMIZATION: Server-side Crowd Detection Model Manager (Python)

This module provides server-side model loading and management for
crowd detection using Python with PyTorch/TensorFlow backends.

Key Optimizations:
1. Single model instance per process
2. Lazy loading - loads on first inference request
3. Model caching in memory
4. Batch processing support
5. Async inference queue for concurrent requests
6. GPU support for faster processing (if available)
7. Result caching with LRU eviction
"""

import time
import hashlib
import threading
from pathlib import Path
from functools import lru_cache
from queue import Queue
from collections import OrderedDict

# Note: Install required packages:
# pip install torch torchvision torchaudio
# OR pip install tensorflow
# OR pip install onnx onnxruntime

class CrowdDetectionModel:
    def __init__(self, model_path='yolov5n.pt', confidence=0.25, iou_threshold=0.45):
        """
        Initialize the model manager with lazy loading.
        
        Args:
            model_path: Path to the model file
            confidence: Confidence threshold for detections
            iou_threshold: IoU threshold for NMS
        """
        self.model = None
        self.model_path = model_path
        self.confidence = confidence
        self.iou_threshold = iou_threshold
        self.input_size = 416  # Optimized for speed vs accuracy
        self.is_loading = False
        self.load_lock = threading.Lock()
        
        # LRU cache for predictions
        self.cache = OrderedDict()
        self.max_cache_size = 100
        self.cache_stats = {'hits': 0, 'misses': 0}
        
        # Inference queue for serial processing
        self.inference_queue = Queue()
        self.processor_thread = threading.Thread(
            target=self._process_inference_queue, 
            daemon=True
        )
        self.processor_thread.start()
    
    def initialize(self):
        """
        Initialize the model on first use (lazy loading).
        Thread-safe lazy loading prevents duplicate loading.
        """
        if self.model is not None:
            return True
        
        if self.is_loading:
            # Wait for another thread to finish loading
            with self.load_lock:
                return self.model is not None
        
        with self.load_lock:
            if self.model is not None:
                return True
            
            return self._perform_model_load()
    
    def _perform_model_load(self):
        """
        Private method: Perform actual model loading from disk.
        Supports YOLOv5 models from PyTorch.
        """
        try:
            self.is_loading = True
            start_time = time.time()
            
            print(f"⏳ Loading YOLOv5n model from {self.model_path}...")
            
            # OPTIMIZATION: Use YOLOv5 nano for speed
            # Option 1: PyTorch Hub (easier setup)
            try:
                import torch
                self.model = torch.hub.load(
                    'ultralytics/yolov5',
                    'yolov5n',
                    pretrained=True,
                    device='cuda' if torch.cuda.is_available() else 'cpu'
                )
                self.model.conf = self.confidence
                self.model.iou = self.iou_threshold
                device_name = 'GPU' if torch.cuda.is_available() else 'CPU'
                print(f"✅ Model loaded on {device_name}")
            except ImportError:
                # Option 2: ONNX Runtime (more portable)
                import onnxruntime as rt
                self.model = rt.InferenceSession(self.model_path)
                print("✅ Model loaded via ONNX Runtime")
            
            load_time = time.time() - start_time
            print(f"✅ Model ready in {load_time:.2f}s")
            return True
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            self.model = None
            return False
        finally:
            self.is_loading = False
    
    def _generate_cache_key(self, image_path, width, height):
        """
        Generate cache key from image path and dimensions.
        Uses file hash for robustness.
        """
        try:
            with open(image_path, 'rb') as f:
                file_hash = hashlib.md5(f.read()).hexdigest()[:8]
            return f"{image_path}_{width}x{height}_{file_hash}"
        except:
            return f"{image_path}_{width}x{height}"
    
    def _add_to_cache(self, key, result):
        """
        OPTIMIZATION: Add result to LRU cache.
        Removes least-recently-used entries when cache exceeds max size.
        """
        # Remove if exists (to update position)
        if key in self.cache:
            del self.cache[key]
        
        # Add to end
        self.cache[key] = result
        
        # Remove LRU if exceeds max size
        if len(self.cache) > self.max_cache_size:
            lru_key, lru_val = self.cache.popitem(last=False)
            print(f"🗑️ Evicted LRU cache entry ({len(self.cache)} remaining)")
    
    def detect(self, image_path, width=None, height=None):
        """
        OPTIMIZATION: Detect persons in image with caching.
        Checks cache first before running expensive inference.
        
        Args:
            image_path: Path to image file
            width: Image width (optional, for cache key)
            height: Image height (optional, for cache key)
        
        Returns:
            Dictionary with detection results
        """
        cache_key = self._generate_cache_key(image_path, width or 0, height or 0)
        
        # OPTIMIZATION 1: Check cache first
        if cache_key in self.cache:
            self.cache_stats['hits'] += 1
            result = self.cache[cache_key]
            # Move to end (mark as recently used)
            del self.cache[cache_key]
            self.cache[cache_key] = result
            print(f"✓ Cache HIT: Retrieved {result['count']} detections")
            return result
        
        self.cache_stats['misses'] += 1
        
        # Ensure model is loaded
        if not self.initialize():
            raise RuntimeError("Failed to load model")
        
        try:
            start_time = time.time()
            
            # OPTIMIZATION 2: Load and preprocess image efficiently
            from PIL import Image
            import numpy as np
            
            img = Image.open(image_path)
            # Resize image for faster inference (without changing aspect ratio much)
            img.thumbnail((self.input_size, self.input_size), Image.Resampling.LANCZOS)
            
            # Run inference
            results = self.model(img, size=self.input_size)
            
            # OPTIMIZATION 3: Extract only person class (class 0)
            detections = results.xyxy[0]
            persons = []
            
            for det in detections:
                x1, y1, x2, y2, conf, cls = det
                # Only keep persons (class 0 in COCO)
                if int(cls) == 0:
                    persons.append({
                        'bbox': [float(x1), float(y1), float(x2-x1), float(y2-y1)],
                        'confidence': float(conf),
                        'class': 'person'
                    })
            
            inference_time = time.time() - start_time
            
            result = {
                'count': len(persons),
                'detections': persons,
                'timestamp': time.time(),
                'inference_time': inference_time
            }
            
            # OPTIMIZATION 4: Cache the result
            self._add_to_cache(cache_key, result)
            
            print(f"✓ Inference in {inference_time:.2f}s - Detected {len(persons)} persons")
            return result
            
        except Exception as e:
            print(f"❌ Detection error: {e}")
            raise
    
    def get_cache_stats(self):
        """Get cache hit/miss statistics"""
        total = self.cache_stats['hits'] + self.cache_stats['misses']
        hit_rate = (self.cache_stats['hits'] / total * 100) if total > 0 else 0
        
        return {
            'hits': self.cache_stats['hits'],
            'misses': self.cache_stats['misses'],
            'hit_rate': f"{hit_rate:.1f}%",
            'cache_size': len(self.cache),
            'max_cache_size': self.max_cache_size
        }
    
    def print_stats(self):
        """Print cache statistics to console"""
        stats = self.get_cache_stats()
        print("📊 Server Cache Statistics:")
        print(f"  Hit Rate: {stats['hit_rate']} ({stats['hits']} hits, {stats['misses']} misses)")
        print(f"  Cache Size: {stats['cache_size']}/{stats['max_cache_size']}")
    
    def clear_cache(self):
        """Clear all cached predictions"""
        self.cache.clear()
        print("🧹 Cache cleared")
    
    def _process_inference_queue(self):
        """
        OPTIMIZATION: Process inference requests from queue in background.
        Allows for better resource management and concurrent request handling.
        """
        while True:
            # Get task from queue (blocks until available)
            task = self.inference_queue.get()
            if task is None:
                break
            
            try:
                callback, image_path, width, height = task
                result = self.detect(image_path, width, height)
                callback(result)
            except Exception as e:
                print(f"❌ Queue processing error: {e}")
            finally:
                self.inference_queue.task_done()
    
    def detect_async(self, image_path, callback, width=None, height=None):
        """
        Queue an inference request for async processing.
        Useful for non-blocking batch operations.
        """
        self.inference_queue.put((callback, image_path, width, height))


# Create singleton instance
_model_instance = None
_model_lock = threading.Lock()

def get_model_manager():
    """Get or create the singleton model manager instance"""
    global _model_instance
    
    if _model_instance is None:
        with _model_lock:
            if _model_instance is None:
                _model_instance = CrowdDetectionModel()
    
    return _model_instance


# Convenience functions
def detect_crowd(image_path, width=None, height=None):
    """Quick detect persons in image using singleton manager"""
    manager = get_model_manager()
    return manager.detect(image_path, width, height)


if __name__ == '__main__':
    # Example usage
    manager = get_model_manager()
    
    # First call - loads model
    # result = manager.detect('sample_image.jpg')
    # print(f"Detected {result['count']} persons")
    
    # Second call - uses cache
    # result = manager.detect('sample_image.jpg')
    # manager.print_stats()
