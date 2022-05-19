import { io, Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../types/Types';

const URL = 'http://localhost:5000';
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false,
});

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });

export default socket;
