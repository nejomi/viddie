export interface User {
  name: string;
  type: 'guest' | 'host';
}

export interface RoomDetails {
  magnet: string | null;
}

export interface Message {
  id: string;
  from: string;
  body: string;
}