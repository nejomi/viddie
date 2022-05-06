import {
  Box,
  Container,
  Heading,
  Flex,
  Text,
  Center,
  Input,
  Icon,
  Switch,
  Button,
  Progress,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiDocumentAdd } from 'react-icons/hi';
import useHash from '../../hooks/useHash';
import WhatsThis from './WhatsThis';
import { useNavigate } from 'react-router-dom';
import socket from '../../utils/socket';
import getLength from '../../utils/getLength';
import { VideoDetails } from '../../types/Types';

const stateMessages = {
  'HASHING FILE': 'Hashing file',
  'GETTING VIDEO DETAILS': 'Getting video details',
  'WAITING FOR SERVER': 'Waiting for server',
};

type CreatingState =
  | 'WAITING'
  | 'HASHING FILE'
  | 'GETTING VIDEO DETAILS'
  | 'WAITING FOR SERVER';

const Create = () => {
  const [name, setName] = useState<string>('');
  const [file, setFile] = useState<File>();
  const [path, setPath] = useState<string>('');
  const [hashEnabled, setHashEnabled] = useState<boolean>(false);
  const [creatingState, setCreatingState] = useState<CreatingState>('WAITING');
  const { progress, getHash } = useHash();
  const toast = useToast();
  const navigate = useNavigate();

  // dropzone hook
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: 'video/mp4',
    onDropAccepted: (files) => {
      const videoFile = files[0];
      setFile(videoFile);
      setPath(URL.createObjectURL(videoFile));
    },
    onDropRejected: () => {
      // show error
      toast({
        title: 'File not supported',
        description: 'Please select one (1) mp4 file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // on socket connect listener
  useEffect(() => {
    socket.on('connect', () => {
      socket.on('room created', ({ room }) => {
        console.log(room);
        console.log(room);
        navigate(`/${room}`);
      });
    });

    return () => {
      socket.off();
    };
  }, [navigate]);

  const handleCreate = async () => {
    if (!file) return;

    setCreatingState('GETTING VIDEO DETAILS');

    const username = name === '' ? 'User' : name;
    socket.auth = { username };

    const length = await getLength(path);
    console.log(length);

    let hash: string | null = null;
    if (hashEnabled) {
      setCreatingState('HASHING FILE');
      hash = await getHash(file);
      console.log(hash);
    }

    setCreatingState('WAITING FOR SERVER');

    const videoDetails: VideoDetails = {
      size: file.size,
      length: length,
      hash: hash,
    }

    socket.connect();
    socket.emit('create room', videoDetails);
  };

  console.log(file);

  return (
    <Container h='100vh' maxW='container.xl'>
      <Flex h='full' flexDir='row' alignItems='center' justifyContent='center'>
        {/* Left */}
        <Flex mr={4} h='full' alignItems='center' justifyContent='center'>
          <Box>
            <Center>
              <Heading size='2xl' mb={4}>
                Viddie
              </Heading>
            </Center>
            <Box
              d='flex'
              position='relative'
              flexDir='column'
              justifyContent='space-between'
              w='sm'
              borderRadius='lg'
              boxShadow='sm'
            >
              {/* Creating overlay */}
              {creatingState !== 'WAITING' && (
                <Flex
                  w='full'
                  h='full'
                  bg='gray.700'
                  zIndex='10'
                  position='absolute'
                  borderRadius='lg'
                  bgColor='rgba(23,25,35,0.95)'
                  flexDir='column'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Spinner mb={1} />
                  <Text fontWeight='semibold' mb={2}>
                    {stateMessages[creatingState]}
                  </Text>
                  {creatingState === 'HASHING FILE' && (
                    <Progress value={progress} w='52' hasStripe size='lg' />
                  )}
                </Flex>
              )}
              <Box as='form' p={8} borderRadius='lg' bg='gray.700' w='full'>
                <Center>
                  <Text as='h1' mb={4} fontSize='2xl' fontWeight='semibold'>
                    Create a party
                  </Text>
                </Center>

                <Box as='section' mb={4}>
                  <Text as='label' d='block' fontWeight='medium' mb={2}>
                    Display Name
                  </Text>
                  <Input
                    placeholder='User'
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                  ></Input>
                </Box>

                {/* Video */}
                <Box as='section' mb={4}>
                  <Text as='label' d='block' fontWeight='medium' mb={2}>
                    Video
                  </Text>
                  <Box
                    w='full'
                    h='120px'
                    bg='gray.600'
                    borderRadius='lg'
                    border='2px'
                    mb={2}
                    borderStyle='dashed'
                    borderColor='gray.400'
                    _hover={{
                      borderColor: 'blue.500',
                    }}
                    p={4}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <Flex
                      h='full'
                      alignItems='center'
                      justifyContent='center'
                      flexDir='column'
                    >
                      <Icon as={HiDocumentAdd} boxSize={8} color='blue.200' />
                      <Text fontSize='sm'>
                        Click or drag your mp4 video here
                      </Text>
                    </Flex>
                  </Box>
                  <Flex fontSize='sm' color='gray.300'>
                    {file ? (
                      <>
                        <Text isTruncated mr={2}>
                          {file.name}
                        </Text>
                        <Text whiteSpace='nowrap'>{`(${prettyBytes(
                          file.size
                        )})`}</Text>
                      </>
                    ) : (
                      <Text>No video selected</Text>
                    )}
                  </Flex>
                </Box>

                <Box as='section' mb={4}>
                  <Flex alignItems='center' mb={2}>
                    <Text as='label' d='block' fontWeight='semibold'>
                      Checksum
                    </Text>
                    <WhatsThis />
                  </Flex>

                  <Flex alignItems='center'>
                    <Text mr={2} as='label'>
                      Verify MD5 checksum
                    </Text>
                    <Switch
                      isChecked={hashEnabled}
                      onChange={(e) => setHashEnabled(e.target.checked)}
                    />
                  </Flex>
                </Box>

                <Button
                  w='full'
                  colorScheme='blue'
                  disabled={!file}
                  onClick={handleCreate}
                  isLoading={creatingState !== 'WAITING'}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Box>
        </Flex>

        {/* Right */}
        <Box w='full' maxW='640px' h='full'>
          <Flex
            w='full'
            h='full'
            flexDir='column'
            alignItems='center'
            justifyContent='center'
          >
            <Box w='full' h='full' maxH='360px' mb={2}>
              {file ? (
                <Box
                  as='video'
                  w='full'
                  h='full'
                  src={path}
                  bg='black'
                  muted
                  controls
                />
              ) : (
                <Flex
                  w='full'
                  h='full'
                  alignItems='center'
                  justifyContent='center'
                  bg='black'
                >
                  <Text fontWeight='semibold'>Waiting for video</Text>
                </Flex>
              )}
            </Box>
            <Text
              w='full'
              fontSize='lg'
              isTruncated
              visibility={file ? undefined : 'hidden'}
            >
              {file ? file.name : 'No video selected'}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default Create;
