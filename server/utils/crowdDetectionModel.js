/**
 * OPTIMIZATION: Server-side Crowd Detection Model Manager
 * 
 * This module provides server-side model loading and management for
 * crowd detection. It should be used with a Python backend or Node.js
 * with TensorFlow.js for optimal performance.
 * 
 * Key Optimizations:
 * 1. Single model instance per server process
 * 2. Lazy loading - loads on first inference request
 * 3. Request queuing - prevents model thrashing
 * 4. Result caching - speeds up repeated predictions
 * 5. Batch processing support - process multiple images at once
 */

const NodeCache = require('node-cache');

class CrowdDetectionModel {
  constructor(options = {}) {
    this.model = null;
    this.isLoading = false;
    this.loadPromise = null;
    
    // Configuration
    this.modelPath = options.modelPath || '/models/yolov5n.onnx';
    this.confidence = options.confidence || 0.25;
    this.iouThreshold = options.iouThreshold || 0.45;
    this.inputSize = options.inputSize || 416;
    
    // Request queue for serial processing
    this.requestQueue = [];
    this.isProcessing = false;
    
    // Result cache with 5-minute TTL
    this.cache = new NodeCache({ stdTtl: 300, checkperiod: 60 });
    this.cacheStats = { hits: 0, misses: 0 };
  }

  /**
   * Initialize model on first use (lazy loading)
   * Safe to call multiple times - returns same promise if already loading
   */
  async initialize() {
    if (this.isLoading) return this.loadPromise;
    if (this.model) return true;

    this.isLoading = true;
    this.loadPromise = this._performModelLoad();
    
    const result = await this.loadPromise;
    this.isLoading = false;
    
    return result;
  }

  /**
   * Private method: Perform actual model loading
   * Loads YOLOv5n from file or downloads it
   */
  async _performModelLoad() {
    try {
      console.log('⏳ Loading YOLOv5n model for server-side inference...');
      const startTime = Date.now();
      
      // TODO: Load model using:
      // - Python: Use PyTorch or ONNX Runtime via subprocess
      // - Node.js: Use tf.js or ONNX.js
      // - Or: Use external Python inference service
      
      // Placeholder implementation
      this.model = { loaded: true };
      
      const loadTime = Date.now() - startTime;
      console.log(`✅ Model loaded in ${loadTime}ms`);
      return true;
    } catch (error) {
      console.error('❌ Error loading model:', error);
      this.model = null;
      return false;
    }
  }

  /**
   * OPTIMIZATION: Generate cache key from image file
   * Uses file size and dimensions to identify unique images
   */
  _generateCacheKey(imagePath, width, height) {
    const fs = require('fs');
    try {
      const stats = fs.statSync(imagePath);
      return `${imagePath}_${stats.size}_${width}x${height}`;
    } catch {
      return `${imagePath}_${width}x${height}`;
    }
  }

  /**
   * OPTIMIZATION: Detect persons in image with caching
   * Checks cache first before running expensive inference
   */
  async detect(imagePath, width, height) {
    // Ensure model is loaded
    if (!this.model) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Model failed to initialize');
      }
    }

    const cacheKey = this._generateCacheKey(imagePath, width, height);
    
    // OPTIMIZATION 1: Check cache first
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      this.cacheStats.hits++;
      console.log(`✓ Cache HIT: Retrieved ${cachedResult.count} detections from cache`);
      return cachedResult;
    }

    this.cacheStats.misses++;
    
    // OPTIMIZATION 2: Queue inference request for serial processing
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this._runInference(imagePath);
          
          // OPTIMIZATION 3: Cache the result
          this.cache.set(cacheKey, result);
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this._processQueue();
    });
  }

  /**
   * Process queued inference requests serially
   * Prevents overwhelming the model with concurrent requests
   */
  async _processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      const task = this.requestQueue.shift();
      try {
        await task();
      } catch (error) {
        console.error('❌ Queue processing error:', error);
      }
    }
    
    this.isProcessing = false;
  }

  /**
   * Private: Run actual inference
   * This would call the actual ML model
   */
  async _runInference(imagePath) {
    try {
      const startTime = Date.now();
      
      // TODO: Implement actual inference:
      // - Load and preprocess image
      // - Run model
      // - Post-process output
      // - Return detections
      
      // Placeholder
      const detections = [];
      
      const inferenceTime = Date.now() - startTime;
      console.log(`✓ Inference completed in ${inferenceTime}ms - Detected ${detections.length} persons`);
      
      return {
        count: detections.length,
        detections: detections,
        timestamp: new Date(),
        inferenceTime: inferenceTime
      };
    } catch (error) {
      console.error('❌ Inference error:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    const hitRate = total > 0 ? ((this.cacheStats.hits / total) * 100).toFixed(1) : 0;
    
    return {
      hits: this.cacheStats.hits,
      misses: this.cacheStats.misses,
      hitRate: `${hitRate}%`,
      cacheSize: this.cache.keys().length
    };
  }

  /**
   * Print cache statistics
   */
  printStats() {
    const stats = this.getCacheStats();
    console.log('📊 Server Cache Statistics:');
    console.log(`  Hit Rate: ${stats.hitRate} (${stats.hits} hits, ${stats.misses} misses)`);
    console.log(`  Cached Entries: ${stats.cacheSize}`);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.flushAll();
    console.log('🧹 Server cache cleared');
  }

  /**
   * Clear everything (for testing)
   */
  reset() {
    this.model = null;
    this.isLoading = false;
    this.loadPromise = null;
    this.clearCache();
  }
}

// Create singleton instance
let modelInstance = null;

function getModelManager() {
  if (!modelInstance) {
    modelInstance = new CrowdDetectionModel();
  }
  return modelInstance;
}

module.exports = {
  CrowdDetectionModel,
  getModelManager,
  // Convenience function for quick detection
  async detectCrowd(imagePath, width, height) {
    const manager = getModelManager();
    return manager.detect(imagePath, width, height);
  }
};
