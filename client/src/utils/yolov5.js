import * as ort from 'onnxruntime-web';

export class YOLOv5Detector {
  constructor() {
    this.model = null;
    this.inputShape = [1, 3, 640, 640];
  }

  async loadModel() {
    try {
      this.model = await ort.InferenceSession.create(
        'https://huggingface.co/Xenova/yolov5s/resolve/main/onnx/model.onnx'
      );
      console.log('YOLOv5s model loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading YOLOv5s:', error);
      return false;
    }
  }

  preprocessImage(img) {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 640, 640);
    
    const imageData = ctx.getImageData(0, 0, 640, 640);
    const pixels = imageData.data;
    
    const red = [], green = [], blue = [];
    for (let i = 0; i < pixels.length; i += 4) {
      red.push(pixels[i] / 255.0);
      green.push(pixels[i + 1] / 255.0);
      blue.push(pixels[i + 2] / 255.0);
    }
    
    const input = Float32Array.from([...red, ...green, ...blue]);
    return new ort.Tensor('float32', input, this.inputShape);
  }

  async detect(image, confThreshold = 0.25, iouThreshold = 0.45) {
    if (!this.model) {
      console.error('Model not loaded');
      return [];
    }

    try {
      const tensor = this.preprocessImage(image);
      const results = await this.model.run({ images: tensor });
      const output = results.output0.data;
      
      const persons = this.processOutput(output, confThreshold, iouThreshold, image.naturalWidth, image.naturalHeight);
      return persons;
    } catch (error) {
      console.error('Detection error:', error);
      return [];
    }
  }

  processOutput(output, confThreshold, iouThreshold, imgWidth, imgHeight) {
    const boxes = [];
    const rows = 25200;
    
    for (let i = 0; i < rows; i++) {
      const confidence = output[i * 85 + 4];
      
      if (confidence > confThreshold) {
        const classScores = [];
        for (let j = 0; j < 80; j++) {
          classScores.push(output[i * 85 + 5 + j]);
        }
        const classId = this.argMax(classScores);
        const classConfidence = classScores[classId];
        const finalConfidence = confidence * classConfidence;
        
        if (classId === 0 && finalConfidence > confThreshold) {
          const x = output[i * 85] * (imgWidth / 640);
          const y = output[i * 85 + 1] * (imgHeight / 640);
          const w = output[i * 85 + 2] * (imgWidth / 640);
          const h = output[i * 85 + 3] * (imgHeight / 640);
          
          boxes.push({
            bbox: [x - w/2, y - h/2, w, h],
            score: finalConfidence,
            class: 'person'
          });
        }
      }
    }
    
    return this.nms(boxes, iouThreshold);
  }

  argMax(array) {
    return array.indexOf(Math.max(...array));
  }

  nms(boxes, iouThreshold) {
    boxes.sort((a, b) => b.score - a.score);
    const keep = [];
    
    while (boxes.length > 0) {
      keep.push(boxes[0]);
      boxes = boxes.slice(1).filter(box => {
        const iou = this.calculateIoU(keep[keep.length - 1].bbox, box.bbox);
        return iou < iouThreshold;
      });
    }
    
    return keep;
  }

  calculateIoU(box1, box2) {
    const [x1, y1, w1, h1] = box1;
    const [x2, y2, w2, h2] = box2;
    
    const xA = Math.max(x1, x2);
    const yA = Math.max(y1, y2);
    const xB = Math.min(x1 + w1, x2 + w2);
    const yB = Math.min(y1 + h1, y2 + h2);
    
    const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
    const box1Area = w1 * h1;
    const box2Area = w2 * h2;
    const unionArea = box1Area + box2Area - interArea;
    
    return interArea / unionArea;
  }
}
