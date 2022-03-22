import { ChakraProvider } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Room from './components/Room/Room';
import UserContext from './utils/user-context';

function App() {
  const [user, setUser] = useState<string>('guest');

  const updateUser = useCallback((user: string) => {
    setUser(user);
  }, []) 

  // const updateUser = (user: string) => {
  //   setUser(user);
  // };

  return (
    <ChakraProvider>
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Main />} />
            <Route path='/:room' element={<Room />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </ChakraProvider>
  );
}

export default App;
