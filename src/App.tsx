import { useCallback, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Room from './components/Room/Room';
import UserContext from './utils/user-context';
import FilepathContext from './utils/filepath-context';
import { User } from './types/Types';
import Create from './components/Create/Create';
import Join from './components/Join/Join';

function App() {
  const [user, setUser] = useState<User>({
    name: 'guest',
    type: 'guest',
  });
  const [filepath, setFilepath] = useState<string>('');

  const updateUser = useCallback((u: User) => {
    setUser(u);
  }, []);

  const updateFilepath = useCallback((f: string) => {
    console.log(f);
    setFilepath(f);
  }, [])

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <FilepathContext.Provider value={{ filepath, updateFilepath }}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Main />} />
            <Route path='/create' element={<Create />} />
            <Route path='/join/:room' element={<Join />} />
            <Route path='/:room' element={<Room />} />
          </Routes>
        </BrowserRouter>
      </FilepathContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
