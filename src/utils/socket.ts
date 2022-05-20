import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../types/Types';

export const URL =
  process.env.REACT_APP_ENV === 'local'
    ? 'http://localhost:5000'
    : 'https://ecollect.site';
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false,
});

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });

export default socket;
