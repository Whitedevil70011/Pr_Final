'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/predict/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Authentic AI</h1>
                <p className="text-sm text-gray-400">NO FAKES, JUST FACTS</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              
            
              <a href="#dataset" className="text-gray-300 hover:text-white transition-colors">Dataset</a>
              <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
              <a href="#use-cases" className="text-gray-300 hover:text-white transition-colors">Use Cases</a>
              <a href="https://drive.google.com/file/d/1V87abImvqQ--_ovccBwONtL24-tr9sB_/view" className="text-gray-300 hover:text-white transition-colors">Research</a>
              <a href="#future-scope" className="text-gray-300 hover:text-white transition-colors">Future Scope</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="w-[70%] ml-[15%] mb-12">
          <div className="">
            <div>
              <h2 className="text-5xl font-bold text-white mb-4">
                Image Forgery Detection
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Before downloading an image
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our Image Forgery Detection system identifies manipulated facial images with unprecedented accuracy, helping safeguard digital media authenticity across selected categories of Unsplash images
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">500000+</div>
                  <div className="text-sm text-gray-400">Images in Dataset</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">98.61%</div>
                  <div className="text-sm text-gray-400">Detection Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">96.98%</div>
                  <div className="text-sm text-gray-400">Precision</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center mt-4">
                <div>
                  <div className="text-3xl font-bold text-white">0.9391</div>
                  <div className="text-sm text-gray-400">F1 Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">99.61%</div>
                  <div className="text-sm text-gray-400">AUC</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">2.18M</div>
                  <div className="text-sm text-gray-400">Trainable Parameters</div>
                </div>
              </div>
            </div>
          </div>

        <div className="flex justify-center items-center">

</div>

        </div>

        {/* Disclaimer Section */}
        <div className="max-w-4xl mx-auto mb-8 mt-16">
          <div className="bg-yellow-900/50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-yellow-400 mb-2">Important Disclaimer</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  This tool provides AI-based analysis for educational and research purposes. Results should not be considered as definitive proof of image authenticity. 
                  Always verify findings through multiple sources and professional forensic analysis for critical applications. The accuracy may vary depending on image quality and manipulation techniques used.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div  id="demo" className="mt-16 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Test Your Image</h3>
            <p className="text-gray-400">Upload an image to detect if it's authentic or a deepfake</p>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-700">
            <div className="flex flex-col items-center gap-8">
              
              {/* Upload Section */}
              <div className="w-full max-w-md">
                <label className="group relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-red-500 rounded-2xl cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:border-red-400">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="mb-2 text-lg text-white group-hover:text-gray-200 font-semibold">
                      Drop your image here
                    </p>
                    <p className="text-sm text-gray-400 mb-2">or click to browse</p>
                    <p className="text-xs text-gray-500 bg-gray-700/60 px-3 py-1 rounded-full">PNG, JPG, JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Preview Section */}
              {preview && (
                <div className="w-full max-w-md animate-fadeIn">
                  <div className="relative aspect-square w-full bg-gray-700 rounded-2xl shadow-xl overflow-hidden border-4 border-gray-600">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-gray-800/95 backdrop-blur-sm rounded-full p-2 shadow-lg border border-green-500">
                        <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-700/80 backdrop-blur-sm rounded-xl border border-gray-600">
                    <p className="text-center text-sm text-gray-300">
                      📁 <span className="font-semibold">{file?.name}</span>
                    </p>
                    <p className="text-center text-xs text-gray-400 mt-1">
                      Size: {(file?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {file && !loading && (
                <button
                  onClick={handleSubmit}
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-red-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fadeIn overflow-hidden hover:bg-red-700"
                >
                  <svg className="w-6 h-6 mr-3 group-hover:animate-pulse relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="relative z-10">Start Analysis</span>
                </button>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center gap-6 animate-fadeIn">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-gray-600 border-t-red-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">Analyzing image...</p>
                    <p className="text-sm text-gray-400 mt-2">Our AI is examining every pixel for authenticity</p>
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {result && (
                <div className="w-full max-w-lg animate-fadeIn">
                  <div className="bg-gray-800 border border-gray-600 p-10 rounded-3xl shadow-2xl">
                    <div className="text-center">
                      <div className="mb-8">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-xl ${
                          result.prediction === 'Authorised' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {result.prediction === 'Authorised' ? (
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete</h2>
                        <p className="text-gray-400">Here are the results from our AI analysis</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Detection Result</p>
                          <div className={`text-3xl font-black px-6 py-4 rounded-2xl shadow-lg ${
                            result.prediction === 'Authorised' 
                              ? 'text-green-400 bg-green-900/30 border-2 border-green-500' 
                              : 'text-red-400 bg-red-900/30 border-2 border-red-500'
                          }`}>
                            {result.prediction === 'Authorised' ? 'AUTHENTIC' : 'DEEPFAKE DETECTED'}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Confidence Level</p>
                          <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-3xl font-black text-white">
                                {(result.confidence * 100).toFixed(1)}%
                              </span>
                              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                                result.confidence > 0.8 ? 'bg-green-900/50 text-green-400 border border-green-500' :
                                result.confidence > 0.6 ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500' :
                                'bg-red-900/50 text-red-400 border border-red-500'
                              }`}>
                                {result.confidence > 0.8 ? 'HIGH' : result.confidence > 0.6 ? 'MEDIUM' : 'LOW'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-4 shadow-inner">
                              <div 
                                className={`h-4 rounded-full transition-all duration-1000 ease-out shadow-sm ${
                                  result.prediction === 'Authorised' 
                                    ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600' 
                                    : 'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                                }`}
                                style={{ width: `${result.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dataset Section */}
        <div id="dataset" className="mt-24 max-w-6xl mx-auto">
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold text-white mb-4">Our Dataset</h2>
    <div className="w-20 h-1 bg-red-500 mx-auto mb-6"></div>
    <p className="text-gray-400 text-lg">
      Comprehensive collection of 500000+ images for robust deepfake detection
    </p>
  </div>

  <div className="flex justify-center"> {/* This line centers the box */}
    <div>
      <h3 className="text-2xl font-bold text-white mb-8 text-center">
        Dataset Distribution
      </h3>
      <div className="space-y-4 bg-gray-800/70 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-gray-700 min-w-[350px] sm:min-w-[580px]">
        {[
          { name: "DFDC", color: "bg-red-500", percentage: "8.33%" },
          { name: "Celeb-DF", color: "bg-orange-500", percentage: "8.33%" },
          { name: "FaceForensics++", color: "bg-yellow-500", percentage: "8.33%" },
          { name: "Real and Fake Image Dataset (Kaggle)", color: "bg-yellow-400", percentage: "8.33%" },
          { name: "DeeperForensics-1.0", color: "bg-green-500", percentage: "8.33%" },
          { name: "FakeAVCeleb", color: "bg-teal-500", percentage: "8.33%" },
          { name: "Generated AI Datasets", color: "bg-cyan-500", percentage: "8.33%" },
          { name: "CASIA v2 Dataset ", color: "bg-blue-500", percentage: "8.33%" },
          { name: "Photoshop Battles Dataset", color: "bg-indigo-500", percentage: "8.33%" },
          { name: "Custom Dataset", color: "bg-purple-500", percentage: "8.33%" },
          { name: "Columbia Image Splicing Dataset", color: "bg-pink-500", percentage: "8.33%" },
          { name: "Realistic Image Tampering Datasets", color: "bg-amber-600", percentage: "8.37%" }
        ].map((category, index) => (
          <div key={index} className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 flex-1">
              <span className="text-gray-300 text-sm w-56">{category.name}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2 relative overflow-hidden">
                <div 
                  className={`h-full ${category.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: category.percentage }}
                ></div>
              </div>
            </div>
            <span className="text-white font-semibold ml-4 w-12 text-right">{category.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

 

        {/* Use Cases Section */}
        <div id="use-cases" className="mt-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Use Cases</h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg">Applications and implementation of our deepfake detection technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Content Platforms */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM5 4h14v8l-4-4-4 4-2-2-4 4V4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Content Platforms</h3>
              <p className="text-gray-400 mb-6">Image hosting platforms like Unsplash can integrate our API to automatically screen uploaded content for deepfakes, maintaining integrity and user trust.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Automated content screening
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Integration via RESTful API
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Customizable confidence thresholds
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Implementation complexity</span>
                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Low</span>
              </div>
            </div>

            {/* News & Media */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">News & Media</h3>
              <p className="text-gray-400 mb-6">News organizations and media outlets can verify the authenticity of images before publication, preventing misinformation and maintaining journalistic integrity.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Pre-publication verification
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Detailed analysis reports
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Batch processing for archives
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Implementation complexity</span>
                <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Medium</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Social Media</h3>
              <p className="text-gray-400 mb-6">Social platforms can implement real-time deepfake screening to prevent the spread of manipulated content and protect users from misinformation.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Real-time analytics at upload
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Content flagging system
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  High-volume processing
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Implementation complexity</span>
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">High</span>
              </div>
            </div>

            {/* Legal & Forensics */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Legal & Forensics</h3>
              <p className="text-gray-400 mb-6">Legal professionals and forensic analysts can verify the authenticity of photographic evidence, ensuring integrity in legal proceedings.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Court-admissible reports
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Detailed manipulation analysis
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Chain of custody tracking
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Implementation complexity</span>
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">High</span>
              </div>
            </div>

            {/* Academic Research */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Academic Research</h3>
              <p className="text-gray-400 mb-6">Researchers can utilize our technology for media studies, advancing the development of more sophisticated detection methods.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  API access for research
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Dataset collaboration
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Advanced metrics access
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Implementation complexity</span>
                <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Medium</span>
              </div>
            </div>

            {/* Authentication Services */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Authentication Services</h3>
              <p className="text-gray-400 mb-6">Identity verification services can implement our technology to ensure submitted photos are not manipulated.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  ID verification checks
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Secure API integration
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Fraud prevention
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Implementation complexity</span>
                <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Medium</span>
              </div>
            </div>
          </div>
                 {/* Future Scope Section */}
<div id="future-scope" className="mt-24 max-w-6xl mx-auto">
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold text-white mb-4">Future Scope</h2>
    <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
    <p className="text-gray-400 text-lg">
      Planned advancements to evolve our deepfake detection platform
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

    {/* 1. Tampering-Type Interpretation */}
    <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
      <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
        {/* List Icon */}
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-4">Tampering-Type Interpretation</h3>
      <p className="text-gray-400 mb-6">
        While the current model performs binary classification (real vs fake), a logical enhancement is to make the system interpretable, where it not only detects fake images but also identifies the specific manipulation technique used. This adds forensic value, transparency, and usability in legal, journalistic, and law enforcement scenarios.
      </p>
      <ul className="space-y-2 mb-6">
        <li className="flex items-center text-sm text-gray-300">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          It can assist in tracing the origin of fakes and choosing suitable countermeasures based on tampering type.
        </li>
        <li className="flex items-center text-sm text-gray-300">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          Train a multi-class classifier or add an auxiliary head to the model to label the type of tampering (e.g., GAN-generated, spliced, morphed, or retouched)
        </li>
        <li className="flex items-center text-sm text-gray-300">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          Adds explainability, helping users understand how the content was faked, not just that it was faked.
        </li>
      </ul>
    </div>

    {/* 2. Real-Time Deepfake Detection */}
    <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
      <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
        {/* Play Icon */}
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 12l18-9v18z"/>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-4">Real-Time Detection</h3>
      <p className="text-gray-400 mb-6">
        Currently optimized for static datasets, the model can be extended to handle real-time detection in live video streams — useful for surveillance systems, video calls, or social media moderation where instant decision-making is crucial.
      </p>
      <ul className="space-y-2 mb-6">
        <li className="flex items-center text-sm text-gray-300">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          Use lightweight architectures (e.g., EfficientNet-Lite or MobileNet), model pruning, and quantization to reduce computational overhead.
        </li>
        <li className="flex items-center text-sm text-gray-300">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          Enables deployment in real-world scenarios with live monitoring and faster decision cycles.
        </li>
        <li className="flex items-center text-sm text-gray-300">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          💡 Can be integrated with APIs in video platforms or embedded in smart cameras for proactive threat detection.
        </li>
      </ul>
    </div>

    {/* 3. Cross-Domain Generalization & Adversarial Robustness */}
    <div className="bg-gray-800 rounded-lg p-8 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
      <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
        {/* Loop Icon */}
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 2.21-1.2 4.15-3 5.19v2.02c2.89-1.13 5-3.99 5-7.21 0-4.42-3.58-8-8-8zm-1 14.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.89 2 2 2v1.93z"/>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-4">Cross-Domain & Robustness</h3>
      <p className="text-gray-400 mb-6">
        The current model is trained on a diverse hybrid dataset, but deepfakes evolve rapidly, and new types can emerge. It's important for future models to be robust against data from unseen distributions and resistant to adversarial attacks that aim to fool detectors.
      </p>
      <ul className="space-y-2 mb-6">
        <li className="flex items-center text-sm text-gray-300">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          Introduce domain-adaptive training, contrastive learning, or fine-tuning with adversarial examples (FGSM, PGD).
        </li>
        <li className="flex items-center text-sm text-gray-300">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          Improves reliability in real-world conditions, making the model future-proof and harder to bypass.
        </li>
        <li className="flex items-center text-sm text-gray-300">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          Crucial for models deployed in public platforms where attackers may actively attempt to evade detection.
        </li>
      </ul>
    </div>
  </div>
</div>


        </div>

        {/* Footer Section */}
        <footer className="mt-32 bg-gray-800 border-t border-gray-700">
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="md:col-span-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Authentic AI</h3>
                    <p className="text-sm text-gray-400">NO FAKES, JUST FACTS</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Distinguishing reality from fabrication in the digital age with advanced Image Forgery Detection technology.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
              

              

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  <li><a href="#home" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a></li>
              
                  <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors text-sm">Demo</a></li>
                  <li><a href="#dataset" className="text-gray-400 hover:text-white transition-colors text-sm">Dataset</a></li>
                  <li><a href="#use-cases" className="text-gray-400 hover:text-white transition-colors text-sm">Use Cases</a></li>

                  <li><a href="#future-scope" className="text-gray-400 hover:text-white transition-colors text-sm">Future Scope</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-lg font-bold text-white mb-6">Resources</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">GitHub Repository</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Setup Guide</a></li>
                  <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors text-sm">Demo</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contributing</a></li>
                  <li><a href="#future-scope" className="text-gray-400 hover:text-white transition-colors text-sm">License</a></li>
                </ul>
              </div>

              {/* Stay Updated */}
              
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm mb-4 md:mb-0">
                  © 2025 UnFake. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </main>
  );
}