import {
  Box,
  Container,
  Heading,
  Flex,
  Text,
  Center,
  Input,
  Switch,
  Button,
  Progress,
  Spinner,
} from '@chakra-ui/react';
import prettyBytes from 'pretty-bytes';
import { useContext, useEffect, useState } from 'react';
import WhatsThis from './WhatsThis';
import { useNavigate } from 'react-router-dom';
import socket from '../../utils/socket';
import FilepathContext from '../../utils/filepath-context';
import Dropzone from '../shared/Dropzone';
import { VideoDetails, VerifyingStatus } from '../../types/Types';
import useHash from '../../hooks/useHash';
import getLength from '../../utils/getLength';
import verifyingMessages from '../../utils/verifyingMessages';
import VerifyOverlay from '../shared/VerifyOverlay';

const Create = () => {
  const [name, setName] = useState<string>('');
  const [file, setFile] = useState<File>();
  const [hashEnabled, setHashEnabled] = useState<boolean>(false);
  const { filepath, updateFilepath } = useContext(FilepathContext);
  
  // custom hooks
  const navigate = useNavigate();
  const [creatingState, setCreatingState] = useState<VerifyingStatus>('WAITING');
  const { progress, getHash } = useHash();

  // on socket connect listener
  useEffect(() => {
    socket.on('connect', () => {
      socket.on('room created', ({ room }) => {
        navigate(`/${room}`);
      });
    });
  }, [navigate]);

  const handleCreate = async () => {
    if (!file) return;

    setCreatingState('GETTING VIDEO DETAILS');

    const length = await getLength(file);
    console.log(length);

    let hash: string | null = null;
    if (hashEnabled) {
      setCreatingState('HASHING FILE');
      hash = await getHash(file);
      console.log(hash);
    }

    setCreatingState('DONE');

    const videoDetails: VideoDetails = {
      size: file.size,
      length: length,
      hash: hash,
    }

    // update file path context
    updateFilepath(URL.createObjectURL(file));

    // socket username
    const username = name === '' ? 'User' : name;
    socket.auth = { username };

    // connect to socket
    socket.connect();
    socket.emit('create room', videoDetails);
  };

  const handleDropAccepted = (files: File[]) => {
    const videoFile = files[0];
    setFile(videoFile);
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
              <VerifyOverlay status={creatingState} hashProgress={progress}/>
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
                  <Dropzone onDropAccepted={handleDropAccepted} />
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
                  src={filepath}
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
