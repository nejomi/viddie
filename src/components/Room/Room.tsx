import {
  Box,
  ChakraProvider,
  Heading,
  Button,
  Input,
  Text,
  Flex,
} from '@chakra-ui/react';
import { HStack } from '@chakra-ui/layout';
import { useRef, useState, useEffect, useContext } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/alert';
import WebTorrent from 'webtorrent';
import { random } from 'lodash';
import socket from '../../utils/socket';
import { useParams } from 'react-router-dom';
import UserContext from '../../utils/user-context';
import Chat from './Chat';
import { Message } from '../../types/Types';

function Room() {
  const { user, updateUser } = useContext(UserContext);
  const [torrent, setTorrent] = useState<string>(
    process.env.REACT_APP_TORRENT ?? ''
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [file, setFile] = useState<File>();
  const [message, setMessage] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const params = useParams();
  const room = params.room!;

  // socket
  useEffect(() => {
    console.log('room use effect');
    if (socket.connected) {
      setLoading(false);
      return;
    }

    const randName = 'joe_' + random(0, 999);
    socket.auth = { username: randName };
    updateUser(randName);
    socket.connect();

    socket.on('connect', () => {
      socket.emit('join room', room);

      socket.on('joined room', () => {
        setLoading(false);
      });
    });

    return () => {
      socket.off('joined room');
    }
  }, [room, updateUser]);

  // listen to file change
  useEffect(() => {
    if (!file) {
      return;
    }

    const client = new WebTorrent();

    console.log('seeding...');
    client.seed(file, (torrent) => {
      console.log('seeding complete!');
      console.log(torrent.magnetURI);
    });
  }, [file]);

  if (loading) {
    return <div>loading...</div>;
  }

  async function loadTorrent() {
    console.log('handle change torrent', torrent);
    const client = new WebTorrent();

    client.add(torrent, function (torrent) {
      console.log(torrent);
      // find the first file that ends with .mp4
      console.log(torrent.files);
      var file = torrent.files.find(function (file) {
        console.log(file);
        return file.name.endsWith('.mp4');
      });

      if (file) {
        console.log(file);
        file.renderTo('video#player');
      } else {
        console.log('nope');
      }
    });
  }

  async function handleSendMessage(message: string) {
    socket.emit('send message', message);
  }

  return (
    <ChakraProvider>
      <Flex>
        <Box w='full' p={6}>
          <Box>
            <Box>
              <Heading size='lg' mb={2}>
                Select File to Seed
              </Heading>
              <input
                type='file'
                onChange={(e) =>
                  e.target.files ? setFile(e.target.files[0]) : null
                }
              ></input>
            </Box>
            <HStack maxW='md' mb='2'>
              <Input
                placeholder='Torrent magnet link'
                value={torrent}
                onChange={(e) => setTorrent(e.target.value)}
              />
              <Button onClick={loadTorrent}>Set torrent</Button>
            </HStack>
            {torrent.length > 0 ? (
              <Box maxW='937px'>
                <video
                  ref={videoRef}
                  id='player'
                  onWaiting={() => console.log('waiting')}
                  onStalled={() => console.log('stalled')}
                  onPlaying={() => console.log('playing')}
                ></video>
                {/* {details ? JSON.stringify(details) : null} */}
              </Box>
            ) : null}
          </Box>
        </Box>
        <Chat onSendMessage={handleSendMessage} />
      </Flex>
    </ChakraProvider>
  );
}

export default Room;
