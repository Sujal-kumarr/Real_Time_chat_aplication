require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

const CORS_ORIGIN = process.env.CLIENT_URL || 'http://localhost:3000';

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// Middleware — match CORS origin with Socket.IO setting
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// MongoDB connection with retry hint
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('👉 Make sure MongoDB is running: mongod');
  });

// REST endpoint — fetch message history
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// REST endpoint — clear all messages
app.delete('/api/messages', async (req, res) => {
  try {
    await Message.deleteMany({});
    io.emit('chatCleared');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear messages' });
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on('sendMessage', async (data) => {
    // Bug fix #5: Validate input before saving to DB
    if (!data || typeof data.sender !== 'string' || typeof data.text !== 'string') {
      return;
    }
    const sender = data.sender.trim().slice(0, 20);
    const text = data.text.trim().slice(0, 500);
    if (!sender || !text) return;

    try {
      const message = await Message.create({ sender, text });
      // Broadcast to ALL connected clients (including sender)
      io.emit('newMessage', message);
    } catch (err) {
      console.error('Error saving message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
