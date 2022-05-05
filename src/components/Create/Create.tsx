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
} from '@chakra-ui/react';
import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiDocumentAdd } from 'react-icons/hi';
import useHash from '../../hooks/useHash';
import WhatsThis from './WhatsThis';

const Create = () => {
  const [file, setFile] = useState<File>();
  const [path, setPath] = useState<string>();
  const [hashEnabled, setHashEnabled] = useState<boolean>(false);
  const { hashing, progress, hash, getHash } = useHash();
  const toast = useToast();

  useEffect(() => {
    if (file && hashEnabled) {
      getHash(file);
    }
  }, [file, hashEnabled]);

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
        isClosable:true
      })
    },
  });

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
              {hashing && (
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
                  <Text fontWeight='semibold' mb={1}>Generating MD5 Checksum</Text>
                    <Progress value={progress} w='52' hasStripe size='lg'/>
                </Flex>
              )}
              <Box p={8} borderRadius='lg' bg='gray.700' as='form' w='full'>
                <Center>
                  <Text as='h1' mb={4} fontSize='2xl' fontWeight='semibold'>
                    Create a party
                  </Text>
                </Center>

                <Box as='section' mb={4}>
                  <Text as='label' d='block' fontWeight='medium' mb={2}>
                    Display Name
                  </Text>
                  <Input placeholder='User'></Input>
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
                      <Text fontSize='sm'>Click or drag your mp4 video here</Text>
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
                  <Text as='label' d='block' fontWeight='semibold' mb={2}>
                    MD5 Checksum
                  </Text>
                  <Input placeholder='Disabled' isDisabled={!hashEnabled} mb={2} value={hashEnabled ? hash : ''}/>

                  <Flex justifyContent='space-between' alignItems='center'>
                    <Flex alignItems='center'>
                      <Text mr={2} as='label'>Verify checksum</Text>
                      <Switch isChecked={hashEnabled} onChange={(e) => setHashEnabled(e.target.checked)}/>
                    </Flex>
                    <WhatsThis />
                  </Flex>
                </Box>

                <Button w='full' colorScheme='blue' disabled={!file}>
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
