export type Magnet = string | null;

export interface User {
  name: string;
  type: 'guest' | 'host';
}

export interface RoomDetails {
  magnet: Magnet;
}

export interface Message {
  id: string;
  from: string;
  body: string;
}

export type VideoEvent = 'PAUSE' | 'PLAY' | 'SEEK';

export type VideoStatus = 'NO MAGNET' | 'LOADING TORRENT' | 'LOADING VIDEO' | 'DONE' ;