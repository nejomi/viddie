import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';
import Room from './Room';
import UserContext from './utils/user-context';

function App() {
  const [user, setUser] = useState<string | null>(null);

  function updateUser (user: string) {
    setUser(user);
  }

  return (
    <ChakraProvider>
      <UserContext.Provider value={{user, updateUser}}>
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
