const famousPlaces = [
  {
    name: 'Taj Mahal',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'Monument',
    latitude: 27.1751,
    longitude: 78.0421,
    maxCapacity: 50000,
    currentCrowd: 32000,
    peakTime: '11 AM - 2 PM'
  },
  {
    name: 'Gateway of India',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'Monument',
    latitude: 18.9220,
    longitude: 72.8347,
    maxCapacity: 30000,
    currentCrowd: 18000,
    peakTime: '5 PM - 8 PM'
  },
  {
    name: 'India Gate',
    city: 'Delhi',
    state: 'Delhi',
    category: 'Monument',
    latitude: 28.6129,
    longitude: 77.2295,
    maxCapacity: 40000,
    currentCrowd: 25000,
    peakTime: '6 PM - 9 PM'
  },
  {
    name: 'Charminar',
    city: 'Hyderabad',
    state: 'Telangana',
    category: 'Monument',
    latitude: 17.3616,
    longitude: 78.4747,
    maxCapacity: 25000,
    currentCrowd: 15000,
    peakTime: '4 PM - 7 PM'
  },
  {
    name: 'Golden Temple',
    city: 'Amritsar',
    state: 'Punjab',
    category: 'Religious',
    latitude: 31.6200,
    longitude: 74.8765,
    maxCapacity: 100000,
    currentCrowd: 45000,
    peakTime: '6 AM - 9 AM'
  },
  {
    name: 'Mysore Palace',
    city: 'Mysuru',
    state: 'Karnataka',
    category: 'Palace',
    latitude: 12.3051,
    longitude: 76.6551,
    maxCapacity: 35000,
    currentCrowd: 12000,
    peakTime: '10 AM - 1 PM'
  },
  {
    name: 'Hampi',
    city: 'Hampi',
    state: 'Karnataka',
    category: 'Historical',
    latitude: 15.3350,
    longitude: 76.4600,
    maxCapacity: 20000,
    currentCrowd: 6000,
    peakTime: '9 AM - 12 PM'
  },
  {
    name: 'Meenakshi Temple',
    city: 'Madurai',
    state: 'Tamil Nadu',
    category: 'Religious',
    latitude: 9.9195,
    longitude: 78.1193,
    maxCapacity: 60000,
    currentCrowd: 42000,
    peakTime: '7 AM - 10 AM'
  },
  {
    name: 'Marina Beach',
    city: 'Chennai',
    state: 'Tamil Nadu',
    category: 'Beach',
    latitude: 13.0499,
    longitude: 80.2824,
    maxCapacity: 80000,
    currentCrowd: 55000,
    peakTime: '5 PM - 8 PM'
  },
  {
    name: 'Red Fort',
    city: 'Delhi',
    state: 'Delhi',
    category: 'Monument',
    latitude: 28.6562,
    longitude: 77.2410,
    maxCapacity: 45000,
    currentCrowd: 28000,
    peakTime: '10 AM - 1 PM'
  },
  {
    name: 'Lotus Temple',
    city: 'Delhi',
    state: 'Delhi',
    category: 'Religious',
    latitude: 28.5535,
    longitude: 77.2588,
    maxCapacity: 25000,
    currentCrowd: 8000,
    peakTime: '9 AM - 12 PM'
  },
  {
    name: 'Qutub Minar',
    city: 'Delhi',
    state: 'Delhi',
    category: 'Monument',
    latitude: 28.5244,
    longitude: 77.1855,
    maxCapacity: 30000,
    currentCrowd: 19000,
    peakTime: '11 AM - 2 PM'
  },
  {
    name: 'Victoria Memorial',
    city: 'Kolkata',
    state: 'West Bengal',
    category: 'Monument',
    latitude: 22.5448,
    longitude: 88.3426,
    maxCapacity: 35000,
    currentCrowd: 14000,
    peakTime: '10 AM - 1 PM'
  },
  {
    name: 'Howrah Bridge',
    city: 'Kolkata',
    state: 'West Bengal',
    category: 'Bridge',
    latitude: 22.5851,
    longitude: 88.3470,
    maxCapacity: 50000,
    currentCrowd: 38000,
    peakTime: '6 PM - 9 PM'
  },
  {
    name: 'Juhu Beach',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'Beach',
    latitude: 19.0990,
    longitude: 72.8265,
    maxCapacity: 70000,
    currentCrowd: 48000,
    peakTime: '5 PM - 8 PM'
  },
  {
    name: 'Tirupati Temple',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    category: 'Religious',
    latitude: 13.6833,
    longitude: 79.3472,
    maxCapacity: 90000,
    currentCrowd: 72000,
    peakTime: '6 AM - 10 AM'
  },
  {
    name: 'Sabarmati Ashram',
    city: 'Ahmedabad',
    state: 'Gujarat',
    category: 'Historical',
    latitude: 23.0606,
    longitude: 72.5797,
    maxCapacity: 15000,
    currentCrowd: 5000,
    peakTime: '10 AM - 1 PM'
  },
  {
    name: 'Dal Lake',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    category: 'Lake',
    latitude: 34.1089,
    longitude: 74.8617,
    maxCapacity: 40000,
    currentCrowd: 16000,
    peakTime: '8 AM - 11 AM'
  },
  {
    name: 'Konark Sun Temple',
    city: 'Konark',
    state: 'Odisha',
    category: 'Religious',
    latitude: 19.8876,
    longitude: 86.0945,
    maxCapacity: 20000,
    currentCrowd: 7000,
    peakTime: '9 AM - 12 PM'
  },
  {
    name: 'Ajanta Caves',
    city: 'Aurangabad',
    state: 'Maharashtra',
    category: 'Historical',
    latitude: 20.5519,
    longitude: 75.7033,
    maxCapacity: 18000,
    currentCrowd: 6500,
    peakTime: '10 AM - 1 PM'
  },
  {
    name: 'Hawa Mahal',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Palace',
    latitude: 26.9239,
    longitude: 75.8267,
    maxCapacity: 28000,
    currentCrowd: 17000,
    peakTime: '11 AM - 2 PM'
  },
  {
    name: 'Amber Fort',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Fort',
    latitude: 26.9855,
    longitude: 75.8513,
    maxCapacity: 32000,
    currentCrowd: 20000,
    peakTime: '10 AM - 1 PM'
  }
];

module.exports = famousPlaces;
