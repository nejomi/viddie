export interface User {
  name: string;
  type: 'guest' | 'host';
}

export interface Message {
  id: string;
  from: string;
  body: string;
}