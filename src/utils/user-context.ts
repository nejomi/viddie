import React from 'react';

export interface UserContextInterface {
  user: string;
  updateUser: (u: string) => void;
}

const UserContext = React.createContext<UserContextInterface>({
  user: '',
  updateUser: () => {}
});

export default UserContext;
