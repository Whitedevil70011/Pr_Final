class ImageDetector {
  constructor() {
    this.apiUrl = 'http://localhost:5000/api';
    this.currentFile = null;
    this.imageDataUrl = null;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    console.log('🚀 Initializing ImageDetector...');
    this.initializeElements();
    this.attachEventListeners();
    this.checkBackendHealth();
  }

  initializeElements() {
    console.log('🔧 Initializing DOM elements...');
    
    // Required element IDs
    this.elementIds = [
      'uploadArea', 'fileInput', 'browseBtn', 'previewSection', 'previewImage',
      'imageName', 'imageSize', 'analyzeBtn', 'clearBtn', 'loadingSection',
      'resultsSection', 'errorSection', 'errorMessage', 'retryBtn',
      'predictionBadge', 'predictionText', 'confidenceFill', 'confidenceText', 'rawScore'
    ];
    
    // Get all elements and store them
    this.elements = {};
    let missingElements = [];
    
    this.elementIds.forEach(id => {
      const element = document.getElementById(id);
      this.elements[id] = element;
      this[id] = element; // Also set as direct property
      
      if (!element) {
        console.error(`❌ Missing element: #${id}`);
        missingElements.push(id);
      } else {
        console.log(`✅ Found element: #${id}`);
      }
    });
    
    if (missingElements.length === 0) {
      console.log('✅ All required DOM elements found');
      return true;
    } else {
      console.error(`❌ Missing ${missingElements.length} elements:`, missingElements);
      this.showError(`Missing HTML elements: ${missingElements.join(', ')}`);
      return false;
    }
  }

  attachEventListeners() {
    console.log('🔧 Attaching event listeners...');
    
    // Validate required elements exist
    if (!this.fileInput || !this.browseBtn || !this.uploadArea) {
      console.error('❌ Cannot attach listeners - missing critical elements');
      return;
    }
    
    try {
      // File input change
      this.fileInput.addEventListener('change', (e) => {
        console.log('📁 File input changed');
        if (e.target.files[0]) {
          this.processFile(e.target.files[0]);
        }
      });
      
      // Browse button click
      this.browseBtn.addEventListener('click', () => {
        console.log('📁 Browse button clicked');
        this.fileInput.click();
      });
      
      // Upload area click
      this.uploadArea.addEventListener('click', (e) => {
        if (e.target === this.uploadArea || e.target === this.uploadArea.querySelector('.upload-text')) {
          console.log('📁 Upload area clicked');
          this.fileInput.click();
        }
      });

      // Drag and drop events
      ['dragover', 'dragleave', 'drop'].forEach(eventName => {
        this.uploadArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (eventName === 'dragover') {
            this.uploadArea.classList.add('dragover');
          } else if (eventName === 'dragleave') {
            this.uploadArea.classList.remove('dragover');
          } else if (eventName === 'drop') {
            this.uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              console.log('📁 File dropped:', files[0].name);
              this.processFile(files[0]);
            }
          }
        });
      });

      // Action buttons
      if (this.analyzeBtn) {
        this.analyzeBtn.addEventListener('click', () => {
          console.log('🔍 Analyze button clicked');
          this.analyzeImage();
        });
      }
      
      if (this.clearBtn) {
        this.clearBtn.addEventListener('click', () => {
          console.log('🧹 Clear button clicked');
          this.clearAll();
        });
      }
      
      if (this.retryBtn) {
        this.retryBtn.addEventListener('click', () => {
          console.log('🔄 Retry button clicked');
          this.hideError();
        });
      }

      // Prevent default drag behaviors on page
      ['dragover', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, (e) => {
          e.preventDefault();
        });
      });
      
      console.log('✅ Event listeners attached successfully');
      
    } catch (error) {
      console.error('❌ Error attaching event listeners:', error);
      this.showError('Error initializing interface');
    }
  }

  async checkBackendHealth() {
    console.log('🏥 Checking backend health...');
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('🏥 Health check response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('🏥 Backend health data:', data);
      
      if (data.model_ready) {
        console.log('✅ Backend is healthy and model is ready');
      } else {
        console.warn('⚠️ Backend is running but model may not be ready');
        this.showError('Backend model not ready. Check server logs.');
      }
      
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      this.showError(`Cannot connect to backend: ${error.message}. Make sure the Flask server is running on port 5000.`);
    }
  }

  processFile(file) {
    console.log('📁 Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      console.error('❌ Invalid file type:', file.type);
      this.showError(`Invalid file type: ${file.type}. Please upload an image file.`);
      return;
    }
    
    // Validate file size (16MB limit)
    const maxSize = 16 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      this.showError(`File too large: ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum size: 16 MB`);
      return;
    }
    
    if (file.size === 0) {
      console.error('❌ Empty file');
      this.showError('File is empty');
      return;
    }
    
    console.log('✅ File validation passed');
    this.currentFile = file;
    this.showPreview(file);
  }

  showPreview(file) {
    console.log('🖼️ Showing preview for:', file.name);
    
    if (!this.previewImage || !this.previewSection) {
      console.error('❌ Preview elements missing');
      this.showError('Preview elements missing from page');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Store image data for persistence
        this.imageDataUrl = e.target.result;
        
        // Update preview
        this.previewImage.src = this.imageDataUrl;
        
        if (this.imageName) this.imageName.textContent = file.name;
        if (this.imageSize) this.imageSize.textContent = this.formatFileSize(file.size);
        
        // Show preview section
        this.previewSection.style.display = 'flex';
        
        // Hide other sections
        this.hideResults();
        this.hideError();
        this.hideLoading();
        
        console.log('✅ Preview displayed successfully');
        
      } catch (error) {
        console.error('❌ Error showing preview:', error);
        this.showError('Error displaying image preview');
      }
    };
    
    reader.onerror = () => {
      console.error('❌ FileReader error');
      this.showError('Error reading file');
    };
    
    reader.readAsDataURL(file);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async analyzeImage() {
    console.log('🔍 Starting image analysis...');
    
    if (!this.currentFile) {
      console.error('❌ No file selected');
      this.showError('Please select an image first');
      return;
    }
    
    console.log('🔍 Analyzing file:', this.currentFile.name);
    
    // Show loading state
    this.showLoading();
    this.hideError();
    this.hideResults();
    
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('file', this.currentFile);
      
      console.log('📤 Sending request to backend...');
      
      // Send request with timeout
      const response = await this.fetchWithTimeout(`${this.apiUrl}/predict`, {
        method: 'POST',
        body: formData
      }, 30000);
      
      console.log('📥 Response received:', response.status, response.statusText);
      
      // Parse response
      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }
      
      console.log('📥 Parsed response:', data);
      
      // Check response status
      if (!response.ok) {
        console.error('❌ HTTP error:', response.status, data);
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Check API response format
      if (!data.success) {
        console.error('❌ API error:', data);
        throw new Error(data.error || 'Analysis failed');
      }
      
      if (!data.result) {
        console.error('❌ No result in response');
        throw new Error('No analysis result received');
      }
      
      console.log('✅ Analysis completed successfully');
      console.log('✅ Result:', data.result);
      
      // Show results
      this.showResults(data.result);
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      this.showError(`Analysis failed: ${error.message}`);
    } finally {
      this.hideLoading();
    }
  }

  async fetchWithTimeout(url, options, timeout = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  showResults(result) {
    console.log('📊 Displaying results:', result);
    
    // Validate required elements
    const requiredElements = ['predictionText', 'predictionBadge', 'confidenceFill', 'confidenceText', 'rawScore', 'resultsSection'];
    const missingElements = requiredElements.filter(id => !this[id]);
    
    if (missingElements.length > 0) {
      console.error('❌ Missing result elements:', missingElements);
      this.showError(`Cannot display results - missing elements: ${missingElements.join(', ')}`);
      return;
    }
    
    // Validate result data
    if (!result.prediction) {
      console.error('❌ No prediction in result');
      this.showError('Invalid result - no prediction data');
      return;
    }
    
    try {
      // Display prediction
      this.predictionText.textContent = result.prediction;
      this.predictionBadge.className = `prediction-badge ${result.prediction.toLowerCase()}`;
      
      // Display confidence
      const confidencePercent = Math.round((result.confidence || 0) * 100);
      this.confidenceFill.style.width = `${confidencePercent}%`;
      this.confidenceText.textContent = `${confidencePercent}%`;
      
      // Display raw score
      if (result.raw_score !== undefined) {
        this.rawScore.textContent = result.raw_score.toFixed(4);
      }
      
      // Display optional fields
      const inferenceTimeEl = document.getElementById('inferenceTime');
      if (inferenceTimeEl && result.inference_time_seconds) {
        inferenceTimeEl.textContent = `${result.inference_time_seconds.toFixed(3)}s`;
      }
      
      const timestampEl = document.getElementById('timestamp');
      if (timestampEl && result.timestamp) {
        const date = new Date(result.timestamp);
        timestampEl.textContent = date.toLocaleString();
      }
      
      // Keep preview visible alongside results
      if (this.previewSection) {
        this.previewSection.style.display = 'flex';
      }
      
      // Show results section
      this.resultsSection.style.display = 'block';
      
      // Hide loading and error
      this.hideLoading();
      this.hideError();
      
      console.log('✅ Results displayed successfully');
      console.log(`📊 Prediction: ${result.prediction} (${confidencePercent}% confidence)`);
      
    } catch (error) {
      console.error('❌ Error displaying results:', error);
      this.showError(`Error displaying results: ${error.message}`);
    }
  }

  showLoading() {
    if (this.loadingSection) {
      this.loadingSection.style.display = 'block';
      console.log('🔄 Loading shown');
    }
  }

  hideLoading() {
    if (this.loadingSection) {
      this.loadingSection.style.display = 'none';
      console.log('🔄 Loading hidden');
    }
  }

  showError(message) {
    console.error('❌ Showing error:', message);
    
    if (this.errorSection && this.errorMessage) {
      this.errorMessage.textContent = message;
      this.errorSection.style.display = 'block';
      console.log('❌ Error section shown');
    } else {
      // Fallback to alert if error elements don't exist
      alert(`Error: ${message}`);
    }
    
    this.hideLoading();
    this.hideResults();
  }

  hideError() {
    if (this.errorSection) {
      this.errorSection.style.display = 'none';
      console.log('❌ Error section hidden');
    }
  }

  hideResults() {
    if (this.resultsSection) {
      this.resultsSection.style.display = 'none';
      console.log('📊 Results section hidden');
    }
  }

  hidePreview() {
    if (this.previewSection) {
      this.previewSection.style.display = 'none';
      console.log('🖼️ Preview section hidden');
    }
    
    // Clear preview data
    if (this.previewImage) {
      this.previewImage.src = '';
    }
    
    if (this.imageName) this.imageName.textContent = '';
    if (this.imageSize) this.imageSize.textContent = '';
    
    this.imageDataUrl = null;
  }

  clearAll() {
    console.log('🧹 Clearing all data...');
    
    // Reset file data
    this.currentFile = null;
    if (this.fileInput) this.fileInput.value = '';
    
    // Hide all sections
    this.hidePreview();
    this.hideResults();
    this.hideError();
    this.hideLoading();
    
    console.log('✅ All data cleared');
  }

  // Utility methods for debugging
  getState() {
    return {
      hasFile: !!this.currentFile,
      fileName: this.currentFile?.name,
      fileSize: this.currentFile?.size,
      hasImageData: !!this.imageDataUrl,
      previewVisible: this.previewSection?.style.display !== 'none',
      resultsVisible: this.resultsSection?.style.display !== 'none',
      loadingVisible: this.loadingSection?.style.display !== 'none',
      errorVisible: this.errorSection?.style.display !== 'none',
      allElementsFound: this.elementIds.every(id => !!this[id])
    };
  }

  validateElements() {
    const missing = this.elementIds.filter(id => !this[id]);
    if (missing.length > 0) {
      console.error('❌ Missing elements:', missing);
      return false;
    }
    console.log('✅ All elements validated');
    return true;
  }
}

// Initialize when script loads
console.log('🚀 ImageDetector script loaded');

// Create global instance
const imageDetector = new ImageDetector();

// Make available globally for debugging
window.imageDetector = imageDetector;

// Debug helper function
window.debugDetector = function() {
  console.log('=== DETECTOR DEBUG INFO ===');
  console.log('State:', imageDetector.getState());
  console.log('Elements valid:', imageDetector.validateElements());
  console.log('Current file:', imageDetector.currentFile?.name);
  console.log('===========================');
};

console.log('✅ ImageDetector initialized successfully');