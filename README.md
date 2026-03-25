<<<<<<< HEAD
# ZONEIQ
=======
# ZoneIQ - Smart Crowd Monitoring and Safety Management System

## Overview
ZoneIQ is a MERN stack application for real-time crowd monitoring and safety management.

## Features
- Real-time crowd monitoring
- Predictive analytics using linear regression
- Alert system for overcrowding
- Panic button for emergencies
- Safe path finding using Dijkstra's algorithm
- Admin and user dashboards

## Tech Stack
- MongoDB
- Express.js
- React.js
- Node.js
- Socket.io

## Installation

### Server
```bash
cd server
npm install
npm start
```

### Client
```bash
cd client
npm install
npm start
```

## Environment Variables
Create a `.env` file in the server directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/zoneiq
JWT_SECRET=your_jwt_secret_key_here
```

## Usage
1. Start MongoDB
2. Run the server: `cd server && npm start`
3. Run the client: `cd client && npm start`
4. Access the application at `http://localhost:3000`
>>>>>>> 65c7d4d (Initial commit - ZONEIQ)
