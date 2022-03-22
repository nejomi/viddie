import { Box, Button, Center, Container, Heading } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { random } from 'lodash';
import socket from '../utils/socket';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  function handleCreateRoom() {
    const randName = 'crissy_' + random(0, 999);
    socket.auth = { username: randName };
    socket.connect();
    socket.emit('create room');
  }

  useEffect(() => {
    socket.on('connect', () => {
      socket.on('room created', ({ room }) => {
        navigate(`/${room}`);
      });
    });

    return () => {
      socket.off();
    }
  }, [navigate]);

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
