export interface User {
  name: string;
  type: 'guest' | 'host';
}

export interface Message {
  id: string;
  from: string;
  body: string;
  type: 'message';
}

export interface Event {
  id: string;
  message: string;
  type: 'event';
}

export interface VideoDetails {
  size: number;
  length: number;
  hash: string | null;
  isPlaying: boolean;
  currentTime: number;
}

export type CreateVideoDetails = Omit<
  VideoDetails,
  'isPlaying' | 'currentTime'
>;

export interface Room {
  host: string;
  videoDetails: VideoDetails;
  updatedOn: number;
}

export interface RoomResponse {
  videoDetails: VideoDetails;
  connectedUsers: number;
}

export type VideoEvent = 'PAUSE' | 'PLAY' | 'SEEK';

export type VideoStatus =
  | 'NO MAGNET'
  | 'LOADING TORRENT'
  | 'LOADING VIDEO'
  | 'DONE';

export type VerifyingStatus =
  | 'WAITING'
  | 'HASHING FILE'
  | 'GETTING VIDEO DETAILS'
  | 'DONE';

// Socket.io types
export interface ServerToClientEvents {
  // room events
  'room created': (d: { room: string }) => void;
  'joined room': (d: { videoDetails: VideoDetails; user: User }) => void;
  'room not found': () => void;
  'magnet updated': (m: string) => void;
  // message event
  'new message': (m: Message) => void;
  // video events
  'update video': (d: { type: string; time: number }) => void;
  'new event': (d: { event: Event }) => void;
}

export interface ClientToServerEvents {
  // room events
  'create room': (videoDetails: CreateVideoDetails) => void;
  'get room details': (roomId: string) => void;
  'join room': (roomId: string) => void;
  'update magnet': (m: string) => void;
  // message event
  'send message': (m: string) => void;
  // video events
  'pause video': (t: number) => void;
  'play video': (t: number) => void;
  'seek video': (t: number) => void;
}
