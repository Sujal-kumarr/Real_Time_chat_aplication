import React, { useState } from 'react';
import JoinForm from './components/JoinForm';
import Chat from './components/Chat';

export default function App() {
  const [username, setUsername] = useState('');

  if (!username) {
    return <JoinForm onJoin={setUsername} />;
  }

  return <Chat username={username} />;
}
