import { io, Socket } from 'socket.io-client';
import { Message, User } from '../types/Types';


interface ServerToClientEvents {
  'room created': (d: { room: string }) => void;
  'joined room': (d: {room: string, user: User}) => void;
  'new message': (m: Message) => void;
  'room not found': () => void;
}

interface ClientToServerEvents {
  'create room': () => void;
  'join room': (r: string) => void;
  'send message': (r: string) => void;
}

const URL = 'http://localhost:5000';
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;