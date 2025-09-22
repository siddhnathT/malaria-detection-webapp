// App.js (updated frontend)
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

// Using your custom icons
import uploadIcon from './assets/upload.png';
import cameraIcon from './assets/camera.png';

import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const webcamRef = useRef(null);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        analyzeImage(file); // Send the file directly
      };
      reader.readAsDataURL(file);
    }
  };

  const captureImage = () => {
    if (isCameraOn && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      setIsCameraOn(false);
      analyzeImage(imageSrc); // Send as base64
    }
  };

  const analyzeImage = (imageData) => {
    setIsLoading(true);
    setPrediction('');
    setConfidence(null);
    
    const formData = new FormData();
    
    if (typeof imageData === 'string') {
      // It's a base64 string from webcam
      formData.append('image', imageData);
    } else {
      // It's a file object
      formData.append('file', imageData);
    }
    
    axios.post('http://localhost:5000/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    })
    .then(response => {
      setPrediction(response.data.result);
      setConfidence(response.data.confidence);
    })
    .catch(error => {
      console.error('Error:', error);
      if (error.code === 'ECONNABORTED') {
        setPrediction('Error: Request timeout. Please try again.');
      } else if (error.response) {
        setPrediction(`Error: ${error.response.status} - ${error.response.data.error}`);
      } else {
        setPrediction('Error analyzing image. Is the server running?');
      }
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Malaria Detection System</h1>
        <p>Upload or capture a microscope image to detect parasites</p>
      </header>

      <div className="input-container">
        <div className="input-section">
          
          <div className="upload-box">
            <label htmlFor="file-upload" className="upload-label">
              <img src={uploadIcon} alt="Click to upload" className="upload-icon-image" />
              <span className="upload-caption">Upload Image</span>
            </label>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </div>

          <div className="webcam-section">
            {isCameraOn ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="webcam"
                  screenshotQuality={0.8}
                />
                <button onClick={captureImage} className="btn capture-btn">
                  <img src={cameraIcon} alt="Capture" className="btn-icon" /> Capture Image
                </button>
              </>
            ) : (
              <button onClick={toggleCamera} className="camera-label">
                <img src={cameraIcon} alt="Click to enable camera" className="camera-icon-image" />
                <span className="camera-caption">Enable Camera</span>
              </button>
            )}
          </div>
        </div>

        {image && (
          <div className="result-section">
            <h2>Image Preview</h2>
            <img src={image} alt="Preview" className="preview-image" />
            
            {isLoading ? (
              <div className="loading">Analyzing...</div>
            ) : (
              prediction && (
                <div className={`prediction ${prediction.toLowerCase()}`}>
                  <h3>
                    Result: {prediction === 'parasitized' ? 'Infected' : 'Healthy'} 
                    {confidence && ` (${confidence}% confidence)`}
                  </h3>
                  <p>Prediction value: {prediction === 'parasitized' ? confidence/100 : 1-confidence/100}</p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Powered by VGG-19 model | React + Flask</p>
      </footer>
    </div>
  );
}

export default App;