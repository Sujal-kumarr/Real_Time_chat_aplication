import React, { useState } from 'react';
import './JoinForm.css';

export default function JoinForm({ onJoin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onJoin(trimmed);
  };

  return (
    <div className="join-container">
      <form className="join-form" onSubmit={handleSubmit}>
        <h1>💬 MERN Chat</h1>
        <p>Enter your name to start chatting</p>
        <input
          type="text"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={20}
        />
        <button type="submit">Join Chat</button>
      </form>
    </div>
  );
}
