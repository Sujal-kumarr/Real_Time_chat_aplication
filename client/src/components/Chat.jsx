import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';
import './Chat.css';

export default function Chat({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef(null);
  const messageIds = useRef(new Set());

  // Connect socket when Chat mounts, disconnect when it unmounts
  useEffect(() => {
    socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  // Load message history on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/messages')
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then((data) => {
        // Track IDs to prevent duplicates
        data.forEach((m) => messageIds.current.add(m._id));
        setMessages(data);
      })
      .catch((err) => console.error('Failed to load messages:', err));
  }, []);

  // Listen for new messages via Socket.IO (deduplicated)
  useEffect(() => {
    const handler = (msg) => {
      if (messageIds.current.has(msg._id)) return; // skip duplicate
      messageIds.current.add(msg._id);
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('newMessage', handler);
    return () => socket.off('newMessage', handler);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !connected) return;

    socket.emit('sendMessage', { sender: username, text: trimmed });
    setInput('');
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>💬 MERN Chat</h2>
        <span className="chat-user">
          Logged in as <strong>{username}</strong>
          <span className={`status-dot ${connected ? 'online' : 'offline'}`} />
        </span>
      </header>

      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="no-messages">No messages yet. Say hello! 👋</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={msg._id || i}
            className={`msg ${msg.sender === username ? 'msg-own' : 'msg-other'}`}
          >
            <div className="msg-sender">{msg.sender}</div>
            <div className="msg-text">{msg.text}</div>
            <div className="msg-time">{formatTime(msg.createdAt)}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder={connected ? 'Type a message...' : 'Connecting...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          disabled={!connected}
          autoFocus
        />
        <button type="submit" disabled={!connected}>
          Send
        </button>
      </form>
    </div>
  );
}

