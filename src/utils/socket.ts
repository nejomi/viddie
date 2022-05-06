import { io, Socket } from 'socket.io-client';
import { Message, User, VideoEvent, VideoDetails } from '../types/Types';

interface ServerToClientEvents {
  'room created': (d: { room: string }) => void;
  'joined room': (d: { videoDetails: VideoDetails; user: User }) => void;
  'new message': (m: Message) => void;
  'room not found': () => void;
  'magnet updated': (m: string) => void;
  'update video': (d: {type: VideoEvent, time: number}) => void;
}

interface ClientToServerEvents {
  'create room': (v: VideoDetails) => void;
  'join room': (r: string) => void;
  'send message': (r: string) => void;
  'update magnet': (m: string) => void;
  // video
  'pause video': (t: number) => void;
  'play video': (t: number) => void;
  'seek video': (t: number) => void;
}

const URL = 'http://localhost:5000';
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
