import { useCallback, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Room from './components/Room/Room';
import UserContext from './utils/user-context';
import { User } from './types/Types';

function App() {
  const [user, setUser] = useState<User>({
    name: 'guest',
    type: 'guest',
  });

  const updateUser = useCallback((u: User) => {
    setUser(u);
  }, []);

  // const updateUser = (user: string) => {
  //   setUser(user);
  // };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Main />} />
          <Route path='/:room' element={<Room />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
