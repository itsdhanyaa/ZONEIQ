import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL);

export const subscribeToAlerts = (callback) => {
  socket.on('newAlert', callback);
  return () => socket.off('newAlert', callback);
};

export const subscribeToCrowdUpdates = (callback) => {
  socket.on('crowdUpdate', callback);
  return () => socket.off('crowdUpdate', callback);
};

export const subscribeToZoneUpdates = (callback) => {
  socket.on('zoneUpdate', callback);
  return () => socket.off('zoneUpdate', callback);
};

export const subscribeToPlaceUpdates = (callback) => {
  socket.on('placeUpdate', callback);
  return () => socket.off('placeUpdate', callback);
};
