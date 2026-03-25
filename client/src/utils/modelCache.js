import { YOLOv5Detector } from './yolov5';

let cachedModel = null;
let loadingPromise = null;

export const getModel = async () => {
  if (cachedModel) {
    return cachedModel;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    const detector = new YOLOv5Detector();
    const loaded = await detector.loadModel();
    if (loaded) {
      cachedModel = detector;
      return detector;
    }
    return null;
  })();

  return loadingPromise;
};
