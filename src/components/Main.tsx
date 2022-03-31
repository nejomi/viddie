import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { random } from 'lodash';
import socket from '../utils/socket';
import { useNavigate } from 'react-router-dom';
import Button from './shared/Button';

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
    };
  }, [navigate]);

  return (
    <Container h='100vh' maxW='container.sm'>
      <Flex
        h='full'
        flexDir='column'
        alignItems='center'
        justifyContent='center'
      >
        <Heading size='3xl' mb={6}>
          Viddie
        </Heading>
        <Box
          bg='bg.lightest'
          h='400px'
          w='full'
          p='12'
          borderRadius='3xl'
          boxShadow='sm'
        >
          <Center h='full' alignItems='center'>
            <Button colorScheme='brand' size='lg' mb={8} onClick={handleCreateRoom}>
              Create Room
            </Button>
          </Center>
        </Box>
      </Flex>
    </Container>
  );
};

export default Main;
