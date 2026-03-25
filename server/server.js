const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const crowdRoutes = require('./routes/crowdRoutes');
const alertRoutes = require('./routes/alertRoutes');
const imageRoutes = require('./routes/imageRoutes');
const placeRoutes = require('./routes/placeRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

console.log('Running without MongoDB - using mock data');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/crowd', crowdRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/places', placeRoutes);
app.use('/uploads', express.static('uploads'));

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

app.set('io', io);

const { startAutoUpdate } = require('./controllers/placeController');
startAutoUpdate(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
