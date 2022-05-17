import getVideoDetails from '../utils/getVideoDetails';

export type Magnet = string | null;

export interface User {
  name: string;
  type: 'guest' | 'host';
}

export interface Message {
  id: string;
  from: string;
  body: string;
}

export interface VideoDetails {
  size: number;
  length: number;
  hash: string | null;
  isPlaying: boolean;
  currentTime: number;
}

export type CreateVideoDetails = Omit<VideoDetails, 'isPlaying' | 'currentTime'>;

export interface Room {
  host: string;
  videoDetails: VideoDetails;
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
