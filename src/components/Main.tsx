import { Box, Button, Center, Container, Heading } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { random } from 'lodash';
import socket from '../utils/socket';
import { useNavigate } from 'react-router-dom';
import UserContext from '../utils/user-context';

const Main = () => {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleCreateRoom() {
    socket.auth = { username: user };
    socket.connect();
    socket.emit('create room');
  }

  useEffect(() => {
    const randName = 'crissy_' + random(0, 999);
    updateUser(randName);

    socket.on('connect', () => {
      socket.on('room created', (details) => {
        const { room } = details;
        socket.emit('join room', room);
      });

      socket.on('joined room', (room) => {
        navigate(`/${room}`);
      });
    });
  }, [navigate, updateUser]);

  return (
    <Box bg='gray.50'>
      <Container h='100vh' d='flex' maxW='container.sm'>
        <Box
          margin='auto'
          h='400px'
          w='full'
          p='12'
          bg='white'
          borderRadius='3xl'
          boxShadow='sm'
        >
          <Center>
            <Heading>Viddie</Heading>
          </Center>
          <Box>
            <Button onClick={handleCreateRoom}>Create room</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Main;
