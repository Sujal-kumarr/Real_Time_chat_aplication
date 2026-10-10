import { io } from 'socket.io-client';

// autoConnect: false prevents connecting before the user joins
const socket = io('http://localhost:5000', { autoConnect: false });

export default socket;

