import { Box, ChakraProvider, Heading, Button } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/layout';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/alert';
import { VideoDetails } from './types/Video';
import { getVideoDetails } from './utils/getVideoDetails';

function App() {
  const [details, setDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  async function handleChange(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    setError(null);

    const files = e.currentTarget.files;
    if (!files || files.length === 0) {
      return;
    }

    if (files.length > 1) {
      setError(`You're only allowed to select 1 file.`);
      return;
    }

    if (files.length === 1) {
      const file = files[0];

      // only mp4
      // const allowedTypes = /(\.mp4|\.ogg|\.bmp|\.gif|\.png)$/i;
      const allowedTypes = /(\.mp4)$/i;

      if (!allowedTypes.exec(file.name)) {
        setError('Selected file type is not mp4.');
        return;
      }

      try {
        setLoading(true);
        const fileDetails = await getVideoDetails(file);

        // revoke existing URL blob
        if (details) {
          URL.revokeObjectURL(details.url);
        }

        setDetails(fileDetails);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          console.log(err);
        }
      }
      setLoading(false);
    }
  }

  function seekTo(time: number) {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  }

  return (
    <ChakraProvider>
      <Box p={6}>
        <Heading pb={6}>Vid Connect</Heading>
        {error ? (
          <Alert mb='4' rounded='md' status='warning'>
            <AlertIcon />
            {error}
          </Alert>
        ) : null}
        <Box>
          <Box mb='2'>
            <input type='file' ref={fileRef} onChange={handleChange} />
          </Box>
          <video
            ref={videoRef}
            width='400'
            src={details ? details.url : undefined}
            controls
          ></video>
          {loading ? 'loading...' : null}
          {details ? JSON.stringify(details) : null}
        </Box>
        <HStack mt={4}>
          <Button>Play</Button>
          <Button>Pause</Button>
          <Button onClick={() => seekTo(194)}>Go to 03:14</Button>
        </HStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
