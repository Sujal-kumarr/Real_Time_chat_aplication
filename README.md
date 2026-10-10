# 💬 MERN Chat App

A real-time chat application built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.IO**.

## Features

- Enter your name to join the chat
- Send and receive messages in real-time
- Messages are persisted in MongoDB
- Chat history loads on connect
- Dark-themed modern UI with message bubbles
- Own messages appear on the right, others on the left

## Prerequisites

- **Node.js** (v16+)
- **MongoDB** running locally on port `27017` (or update `server/.env`)

## Getting Started

### 1. Start MongoDB

Make sure MongoDB is running locally:

```bash
mongod
```

### 2. Setup & Start the Backend

```bash
cd server
npm install
npm run dev
```

The server will start on **http://localhost:5000**.

### 3. Setup & Start the Frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

The React app will open at **http://localhost:3000**.

### 4. Chat!

1. Open **http://localhost:3000** in one browser tab
2. Enter a name and click **Join Chat**
3. Open another tab (or different browser) at the same URL
4. Enter a different name — both users can now chat in real-time!

## Project Structure

```
new_project/
├── server/                  # Backend
│   ├── server.js            # Express + Socket.IO server
│   ├── models/Message.js    # Mongoose message schema
│   ├── package.json
│   └── .env                 # PORT & MONGO_URI config
├── client/                  # Frontend (React)
│   ├── public/index.html
│   └── src/
│       ├── App.js           # Root component (join → chat)
│       ├── socket.js        # Socket.IO client instance
│       └── components/
│           ├── JoinForm.js  # Name entry form
│           ├── Chat.js      # Chat window + message list
│           └── *.css        # Component styles
└── README.md
```

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | React 18            |
| Backend  | Express + Node.js   |
| Database | MongoDB + Mongoose  |
| Realtime | Socket.IO           |
