import {  Center, } from '@chakra-ui/react';
import { useEffect } from 'react';
import { random } from 'lodash';
import socket from '../utils/socket';
import { useNavigate } from 'react-router-dom';
import Button from './shared/Button';
import MainLayout from '../layouts/MainLayout';

const Main = () => {
  const navigate = useNavigate();

  function handleCreateRoom() {
    const randName = 'crissy_' + random(0, 999);
    socket.auth = { username: randName };
    socket.connect();
    // socket.emit('create room');
  }

  useEffect(() => {
    socket.on('connect', () => {
      socket.on('room created', ({ room }) => {
        navigate(`/${room}`);
      });
    });

    return () => {
      socket.off();
    };
  }, [navigate]);

  return (
    <MainLayout>
      <Center h='full' alignItems='center' p={16}>
        <Button colorScheme='brand' size='lg' mb={8} onClick={handleCreateRoom}>
          Create Room
        </Button>
      </Center>
    </MainLayout>
  );
};

export default Main;
