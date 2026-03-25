/**
 * OPTIMIZATION: Prediction Result Cache
 * 
 * Caches detection results to avoid redundant inference on similar images.
 * This is particularly useful when:
 * 1. User re-uploads the same image multiple times
 * 2. Processing batches of similar images
 * 3. Testing or debugging predictions
 * 
 * Cache uses image hash as key for fast lookups.
 * Implements LRU (Least Recently Used) eviction to limit memory usage.
 */

class PredictionCache {
  constructor(maxSize = 50) {
    this.cache = new Map(); // hash => { result, timestamp, hitCount }
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Simple hash function for image data
   * Combines image dimensions, a sample of pixel values, and file size
   * This is fast while still being reasonably unique for similar images
   * 
   * @param {string} base64Data - Base64 encoded image data
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @returns {string} - Hash string
   */
  _generateHash(base64Data, width, height) {
    // Quick hash from dimensions and file size
    const size = base64Data.length;
    const startChar = base64Data.charCodeAt(0);
    const midChar = base64Data.charCodeAt(Math.floor(base64Data.length / 2));
    const endChar = base64Data.charCodeAt(base64Data.length - 1);
    
    // Simple hash combining all factors
    let hash = 5381;
    hash = ((hash << 5) + hash) + width;
    hash = ((hash << 5) + hash) + height;
    hash = ((hash << 5) + hash) + size;
    hash = ((hash << 5) + hash) + startChar;
    hash = ((hash << 5) + hash) + midChar;
    hash = ((hash << 5) + hash) + endChar;
    
    return `${hash}_${width}x${height}`;
  }

  /**
   * Generate cache key from image element
   * 
   * @param {HTMLImageElement} imageElement - Image element to cache
   * @returns {Promise<string>} - Cache key hash
   */
  async generateKeyFromImage(imageElement) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = imageElement.naturalWidth || imageElement.width;
      canvas.height = imageElement.naturalHeight || imageElement.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageElement, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const hash = this._generateHash(
        imageData,
        canvas.width,
        canvas.height
      );
      
      resolve(hash);
    });
  }

  /**
   * Check if prediction result is cached
   * 
   * @param {string} key - Cache key
   * @returns {boolean} - True if cached and fresh
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Get cached prediction result
   * Updates hit count and access time for LRU tracking
   * 
   * @param {string} key - Cache key
   * @returns {object|null} - Cached prediction or null if not found
   */
  get(key) {
    if (!this.cache.has(key)) {
      this.misses++;
      return null;
    }

    const entry = this.cache.get(key);
    entry.timestamp = Date.now(); // Update access time for LRU
    entry.hitCount++;
    this.hits++;
    
    console.log(`✓ Cache HIT: Retrieved ${entry.result.length} detections from cache`);
    console.log(`  Cache stats: ${this.hits} hits, ${this.misses} misses (${((this.hits / (this.hits + this.misses)) * 100).toFixed(1)}% hit rate)`);
    
    return entry.result;
  }

  /**
   * Store prediction result in cache
   * Implements LRU eviction if cache exceeds max size
   * 
   * @param {string} key - Cache key
   * @param {Array} result - Prediction result (array of detections)
   */
  set(key, result) {
    // Remove old entry if exists (to update timestamp)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add new entry
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
      hitCount: 0
    });

    // OPTIMIZATION: LRU eviction - remove least recently used entries
    if (this.cache.size > this.maxSize) {
      // Find the least recently used entry
      let lruKey = null;
      let lruTime = Infinity;
      
      for (const [k, v] of this.cache) {
        if (v.timestamp < lruTime) {
          lruTime = v.timestamp;
          lruKey = k;
        }
      }
      
      if (lruKey) {
        this.cache.delete(lruKey);
        console.log(`🗑️ Cache evicted LRU entry. Cache size: ${this.cache.size}/${this.maxSize}`);
      }
    }
  }

  /**
   * Clear all cached predictions
   */
  clear() {
    this.cache.clear();
    console.log('🧹 Prediction cache cleared');
  }

  /**
   * Get cache statistics
   * 
   * @returns {object} - Statistics about cache performance
   */
  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(1) : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`,
      utilizationPercent: ((this.cache.size / this.maxSize) * 100).toFixed(1)
    };
  }

  /**
   * Print cache statistics to console
   */
  printStats() {
    const stats = this.getStats();
    console.log('📊 Prediction Cache Statistics:');
    console.log(`  Size: ${stats.size}/${stats.maxSize}`);
    console.log(`  Hit Rate: ${stats.hitRate} (${stats.hits} hits, ${stats.misses} misses)`);
    console.log(`  Utilization: ${stats.utilizationPercent}%`);
  }
}

// Create and export singleton cache instance
export const predictionCache = new PredictionCache(50);

// For convenience, also export the class
export default PredictionCache;
