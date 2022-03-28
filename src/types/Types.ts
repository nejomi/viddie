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