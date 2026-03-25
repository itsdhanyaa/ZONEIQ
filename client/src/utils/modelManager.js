import { YOLOv5OptimizedDetector } from './yolov5Optimized';

/**
 * OPTIMIZATION: Singleton Model Manager
 * 
 * Ensures the AI model is loaded ONLY ONCE across the entire application
 * and reused by all components. This eliminates redundant model loading
 * which was causing significant performance degradation.
 * 
 * Key Benefits:
 * 1. Single model instance shared across all components
 * 2. First access triggers lazy loading (not at app startup)
 * 3. Subsequent accesses get the cached instance immediately
 * 4. Memory efficient - model loaded once and never reloaded
 * 5. Thread-safe lazy loading prevents race conditions
 */

class ModelManager {
  constructor() {
    // Singleton instance
    this.detector = null;
    this.loadingPromise = null;
    this.isInitialized = false;
  }

  /**
   * Get or create the singleton detector instance
   * Uses lazy loading - model loads on first access, not at startup
   * 
   * @returns {YOLOv5OptimizedDetector} - The singleton detector instance
   */
  getInstance() {
    if (!this.detector) {
      this.detector = new YOLOv5OptimizedDetector();
    }
    return this.detector;
  }

  /**
   * Initialize the model (loads it if not already loaded)
   * Safe to call multiple times - returns same promise if already loading
   * 
   * @returns {Promise<boolean>} - True if model loaded successfully
   */
  async initialize() {
    const detector = this.getInstance();
    
    // If already loading, return the existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    
    // If already initialized, return immediately
    if (this.isInitialized && detector.isReady()) {
      console.log('✓ Model already initialized and ready');
      return true;
    }
    
    // Start loading and track the promise
    this.loadingPromise = detector.loadModel().then(success => {
      if (success) {
        this.isInitialized = true;
        console.log('✓ Model initialization complete');
        
        // Print optimization summary
        setTimeout(() => {
          detector.printOptimizationSummary();
        }, 100);
      }
      this.loadingPromise = null; // Clear the promise after loading
      return success;
    });
    
    return this.loadingPromise;
  }

  /**
   * Get detector instance after ensuring it's loaded
   * 
   * @returns {Promise<YOLOv5OptimizedDetector>} - The ready-to-use detector
   */
  async getReadyDetector() {
    await this.initialize();
    return this.getInstance();
  }

  /**
   * Check if model is ready for inference
   * 
   * @returns {boolean} - True if model is loaded and ready
   */
  isReady() {
    return this.isInitialized && this.detector?.isReady();
  }

  /**
   * Reset the manager (useful for testing or cleanup)
   */
  reset() {
    this.detector = null;
    this.loadingPromise = null;
    this.isInitialized = false;
    console.log('🔄 Model manager reset');
  }
}

// Create and export the singleton instance
export const modelManager = new ModelManager();

// For convenience, also export the class
export default ModelManager;
