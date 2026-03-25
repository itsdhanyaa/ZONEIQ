import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socketInstance = null;

const getSocket = () => {
  if (!socketInstance || !socketInstance.connected) {
    socketInstance = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
  }
  return socketInstance;
};

export const socket = getSocket();

export const subscribeToAlerts = (callback) => {
  const s = getSocket();
  s.on('newAlert', callback);
  return () => s.off('newAlert', callback);
};

export const subscribeToCrowdUpdates = (callback) => {
  const s = getSocket();
  s.on('crowdUpdate', callback);
  return () => s.off('crowdUpdate', callback);
};

export const subscribeToZoneUpdates = (callback) => {
  const s = getSocket();
  s.on('zoneUpdate', callback);
  return () => s.off('zoneUpdate', callback);
};

export const subscribeToPlaceUpdates = (callback) => {
  const s = getSocket();
  s.on('placeUpdate', callback);
  return () => s.off('placeUpdate', callback);
};
