import { Box, Heading, Flex } from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import socket from '../../utils/socket';
import UserContext from '../../utils/user-context';
import Chat from './Chat';
import Video from './Video';
import client from '../../utils/webtorrent-client';
import useRoomSocket from '../../hooks/useRoomSocket';

function Room() {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState<File>();
  const { loading, roomDetails } = useRoomSocket();

  // listen to file change
  useEffect(() => {
    if (!file) {
      return;
    }

    console.log('seeding...');
    client.seed(
      file,
      {
        announce: [
          'ws://localhost:8000',
        ],
      },
      (torrent) => {
        console.log('seeding complete!');
        console.log(torrent.magnetURI);
        socket.emit('update magnet', torrent.magnetURI);
      }
    );
  }, [file]);

  function handleFileChange(file: File) {
    setFile(file);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomDetails) {
    return <div>Room doesn't exist</div>;
  }

  return (
    <>
      <Flex w='100vw' h='100vh' bg='bg.regular'>
        <Box w='full' h='full'>
          <Video magnet={roomDetails.magnet} />
          {user.type === 'host' && (
            <Box
              d='inline-block'
              mt={6}
              p={4}
              bg='gray.50'
              borderRadius='lg'
              color='gray.500'
            >
              <Heading size='md' mb={2} color='gray.800'>
                Select File to Seed
              </Heading>
              <input
                type='file'
                onChange={(e) =>
                  e.target.files ? handleFileChange(e.target.files[0]) : null
                }
              ></input>
            </Box>
          )}
        </Box>
        <Chat />
      </Flex>
    </>
  );
}

export default Room;
