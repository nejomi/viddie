import { io, Socket } from 'socket.io-client';
import { Message } from '../types/Types';


interface ServerToClientEvents {
  'room created': (d: { room: string }) => void;
  'joined room': (r: string) => void;
  'new message': (m: Message) => void;
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
