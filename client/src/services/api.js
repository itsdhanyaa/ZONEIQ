import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/users/login`, credentials);
  return response.data;
};

export const getZones = async () => {
  const response = await axios.get(`${API_URL}/zones`);
  return response.data;
};

export const getAlerts = async () => {
  const response = await axios.get(`${API_URL}/alerts`);
  return response.data;
};

export const getCrowdData = async (zoneId) => {
  const response = await axios.get(`${API_URL}/crowd/${zoneId}`);
  return response.data;
};
