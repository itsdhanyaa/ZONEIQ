import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import CrowdPrediction from './CrowdPrediction';

const ImageUpload = ({ zoneId, zoneName }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [personCount, setPersonCount] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);
  const [model, setModel] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log('COCO-SSD model loaded');
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setResult(null);
      setPersonCount(0);
    }
  };

  const detectPersons = async () => {
    if (!model || !imageRef.current) return;

    setDetecting(true);
    try {
      const predictions = await model.detect(imageRef.current);
      const persons = predictions.filter(p => p.class === 'person');
      
      setPersonCount(persons.length);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;
      
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      
      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      persons.forEach((person, idx) => {
        const [x, y, width, height] = person.bbox;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 4;
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(scaledX, scaledY - 30, 120, 30);
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Person ${idx + 1}`, scaledX + 5, scaledY - 12);
        ctx.fillText(`${Math.round(person.score * 100)}%`, scaledX + 5, scaledY + 4);
      });

      console.log(`Detected ${persons.length} persons`);
      return persons.length;
    } catch (error) {
      console.error('Detection error:', error);
      return 0;
    } finally {
      setDetecting(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !model || personCount === 0) return;
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('zoneId', zoneId);
    formData.append('detectedCount', personCount);

    try {
      const response = await axios.post('http://localhost:5000/api/image/analyze', formData);
      const newData = {
        count: personCount,
        timestamp: new Date(),
        occupancy: response.data.occupancy
      };
      setHistoricalData(prev => [...prev, newData]);
      setResult({
        ...response.data,
        estimatedCount: personCount
      });
    } catch (error) {
      alert('Error analyzing image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload Image for {zoneName}</h2>
      {!model && <p>Loading AI model...</p>}
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileSelect} 
        disabled={!model} 
      />
      
      {preview && (
        <div className="preview">
          <img 
            ref={imageRef}
            src={preview} 
            alt="Preview" 
            style={{ 
              maxWidth: '600px', 
              width: '100%',
              marginTop: '1rem', 
              display: personCount > 0 ? 'none' : 'block' 
            }} 
            onLoad={() => {
              if (imageRef.current && model) {
                detectPersons();
              }
            }}
            crossOrigin="anonymous"
          />
          <canvas 
            ref={canvasRef} 
            style={{ 
              maxWidth: '600px', 
              width: '100%',
              marginTop: '1rem', 
              display: personCount > 0 ? 'block' : 'none',
              border: '2px solid #3498db'
            }}
          />
          {detecting && <p style={{ color: '#3498db' }}>🔍 Detecting persons...</p>}
          {personCount > 0 && (
            <p style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.2rem' }}>
              ✅ AI Detected: {personCount} person(s)
            </p>
          )}
        </div>
      )}

      {selectedFile && personCount > 0 && (
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Analyzing...' : `Analyze with ${personCount} person(s)`}
        </button>
      )}

      {result && (
        <div className={`result ${result.status}`}>
          <h3>Analysis Result</h3>
          <p><strong>Detected Persons:</strong> {result.estimatedCount}</p>
          <p><strong>Max Capacity:</strong> {result.maxCapacity}</p>
          <p><strong>Occupancy:</strong> {result.occupancy}%</p>
          <p><strong>Status:</strong> {result.status.toUpperCase()}</p>
          <div className={`alert ${result.severity}`} style={{ marginTop: '1rem' }}>
            {result.alert}
          </div>
        </div>
      )}

      {historicalData.length >= 3 && (
        <CrowdPrediction historicalData={historicalData} />
      )}

      {historicalData.length > 0 && (
        <div className="historical-data">
          <h3>Historical Data (for Linear Regression)</h3>
          <div className="data-points">
            {historicalData.map((data, idx) => (
              <div key={idx} className="data-point">
                <span>Upload {idx + 1}: {data.count} persons ({data.occupancy}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
