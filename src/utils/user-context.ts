import React from 'react';
import { User } from '../types/Types';

export interface UserContextInterface {
  user: User;
  updateUser: (u: User) => void;
}

const UserContext = React.createContext<UserContextInterface>({
  user: {
    name: '',
    type: 'guest'
  },
  updateUser: () => {}
});

export default UserContext;
