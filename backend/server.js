const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import and use route files
const chatRoutes = require('./routes/chat');
const tasksRoutes = require('./routes/tasks');
const notificationsRoutes = require('./routes/notifications');
const missionsRoutes = require('./routes/missions');

app.use('/api/chat', chatRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/missions', missionsRoutes);

app.get('/', (req, res) => {
  res.send('TaskMate backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 