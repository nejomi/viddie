import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type VerifyingStatus,
  type RoomResponse,
  type VideoDetails,
} from '../../types/Types';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  LightMode,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useToast,
} from '@chakra-ui/react';
import VideoSection from '../shared/VideoSection';
import useHash from '../../hooks/useHash';
import VerifyOverlay from '../shared/VerifyOverlay';
import prettyBytes from 'pretty-bytes';
import { intervalToDuration } from 'date-fns';
import getLength from '../../utils/getLength';
import socket, { URL as serverURL } from '../../utils/socket';
import FilepathContext from '../../utils/filepath-context';

const Join = () => {
  const { room } = useParams();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File>();
  const [name, setName] = useState<string>('');

  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [users, setUsers] = useState<number>(0);
  const [canJoin, setCanJoin] = useState(false);
  const [status, setStatus] = useState<VerifyingStatus>('WAITING');
  const { progress, getHash } = useHash();
  const toast = useToast();
  const navigate = useNavigate();

  const { updateFilepath } = useContext(FilepathContext);

  // get room details
  useEffect(() => {
    const getDetails = async () => {
      try {
        const { data } = await axios.get<RoomResponse>(
          serverURL + '/room-details/' + room,
          { withCredentials: true }
        );

        setLoading(false);
        setVideoDetails(data.videoDetails);
        setUsers(data.connectedUsers);
      } catch (e) {
        // TODO: add universal error handler
        // const error = e as Error;
        setLoading(false);
        // change
        toast({
          title: 'Room ' + room + ' does not exist',
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      }
    };

    getDetails();

    return () => {
      toast.closeAll();
    }
  }, []);

  // sockets
  useEffect(() => {
    socket.on('connect', () => {
      navigate(`/${room}`);
    });
  }, []);

  const handleDropAccepted = async (files: File[]) => {
    if (!videoDetails) return;

    const file = files[0];
    setFile(file);

    setStatus('GETTING VIDEO DETAILS');
    const size = file.size;
    if (size !== videoDetails.size) {
      return showErrorToast('File size does not match');
    }

    const length = await getLength(file);
    if (length !== videoDetails.length) {
      return showErrorToast('File length does not match');
    }

    if (videoDetails.hash) {
      setStatus('HASHING FILE');
      const hash = await getHash(file);
      if (hash !== videoDetails.hash) {
        return showErrorToast('File checksum does not match');
      }
    }

    setStatus('DONE');
    setCanJoin(true);
    toast({
      title: 'Video verified',
      description: "Your video matches the host's video!",
      duration: 3000,
      isClosable: true,
      status: 'success',
    });
  };

  const showErrorToast = (message: string) => {
    setFile(undefined);
    setStatus('DONE');
    setCanJoin(false);
    toast({
      title: 'Wrong video',
      description: message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const formatLength = (length: number) => {
    const duration = intervalToDuration({ start: 0, end: length * 1000 });

    // prepend 0
    function formatNum(number: number) {
      return number.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
    }

    return `${duration.hours ? formatNum(duration.hours) + ':' : ''}${
      duration.minutes ? formatNum(duration.minutes) + ':' : ''
    }${duration.seconds ? formatNum(duration.seconds) : ''}`;
  };

  const handleJoinRoom = () => {
    if (!canJoin || !file) return;

    // socket username
    const username = name === '' ? 'User' : name;
    socket.auth = { username };

    // update file path context
    updateFilepath(URL.createObjectURL(file));

    // connect to socket
    socket.connect();
  };

  if (loading) {
    return <div>loading</div>;
  }

  if (!loading && videoDetails === null) {
    return <div>Room doesn't exist</div>;
  }

  return (
    <Flex w='full' h='100vh' justifyContent='center' alignItems='center'>
      <Flex w='full' maxW='container.lg' h='600px' borderRadius='lg'>
        <Box
          w='full'
          maxW='sm'
          p={8}
          position='relative'
          bg='gray.700'
          borderLeftRadius='lg'
        >
          <VerifyOverlay status={status} hashProgress={progress} closeOnDone />
          <Box w='full'>
            <Box mb={8}>
              <Heading size='lg'>
                You are invited to join a{' '}
                <Box as='span' color='blue.500'>
                  Viddie
                </Box>{' '}
                party!
              </Heading>
            </Box>
            <Box as='section' mb={4}>
              <Text as='label' d='block' mb={2} fontWeight='medium'>
                Display Name
              </Text>
              <Input
                type='text'
                placeholder='User'
                name='name'
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </Box>
            <VideoSection file={file} onDropAccepted={handleDropAccepted} />
          </Box>

          <Box w='full'>
            <Button
              w='full'
              disabled={!canJoin}
              colorScheme='blue'
              onClick={handleJoinRoom}
            >
              Join Room
            </Button>
          </Box>
        </Box>

        {/* Right side  */}
        <Box
          w='full'
          bgGradient='linear(to-r, blue.200, purple.200)'
          color='gray.800'
          p={8}
          borderRightRadius='lg'
        >
          {videoDetails && (
            <>
              <Flex mb={4}>
                <Flex mr={4}>
                  <Text color='gray.800' fontWeight='medium' mr={1}>
                    Room ID:
                  </Text>
                  <Text fontWeight='regular' letterSpacing='wider'>
                    {room}
                  </Text>
                </Flex>
                <Flex>
                  <Text color='gray.800' fontWeight='medium' mr={1}>
                    Users:
                  </Text>
                  <Text fontWeight='regular' letterSpacing='wider'>
                    {users}
                  </Text>
                </Flex>
              </Flex>
              <Text fontWeight='bold' fontSize='2xl' mb={2}>
                Select the same video the host selected.
              </Text>
              <Text fontSize='lg' mb={12}>
                {videoDetails.hash
                  ? 'The host of this room enabled MD5 Checksum verification before joining.'
                  : 'Users joining will need to verify video length and file size.'}
              </Text>
              <Text fontSize='xl' fontWeight='medium' mb={2}>
                Video Details
              </Text>

              <Box mb={12}>
                <Flex>
                  <Stat p={2} mb={2} size='sm'>
                    <StatLabel>Size</StatLabel>
                    <StatNumber>{prettyBytes(videoDetails.size)}</StatNumber>
                  </Stat>

                  <Stat p={2} mb={2} size='sm'>
                    <StatLabel>Length</StatLabel>
                    <StatNumber>{formatLength(videoDetails.length)}</StatNumber>
                  </Stat>
                </Flex>

                <Stat p={2} size='sm'>
                  <StatLabel>MD5 Checksum</StatLabel>
                  <StatNumber>
                    {videoDetails.hash ? videoDetails.hash : 'Disabled'}
                  </StatNumber>
                </Stat>
              </Box>

              {canJoin && (
                <LightMode>
                  <Alert status='success'>
                    <AlertIcon />
                    Video verified! You can now join the room.
                  </Alert>
                </LightMode>
              )}
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Join;
