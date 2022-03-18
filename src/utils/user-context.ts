import React from 'react';

export interface UserContextInterface {
  user: string | null;
  updateUser: (u: string) => void;
}

const UserContext = React.createContext<UserContextInterface>({
  user: '',
  updateUser: () => {}
});

export default UserContext;
