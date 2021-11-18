import { Box, ChakraProvider, Heading, Button } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/layout';
import React, { useRef, useState } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/alert';
import { VideoDetails, Subtitles } from './types/Video';
import { getVideoDetails } from './utils/getVideoDetails';
import ReactPlayer from 'react-player';

function App() {
  const [details, setDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<String | null>();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<ReactPlayer>(null);

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

        let oldURL;
        if (details) {
          oldURL = details.url;
        }

        setDetails(fileDetails);

        if (oldURL) {
          URL.revokeObjectURL(oldURL);
        }
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

  function handleSeek(seconds: number) {
    if (videoRef.current) {
      videoRef.current.seekTo(seconds);
    }
  }

  function handleProgress(callback: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) {
    console.log(callback.played);
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
          <Box maxW='937px'>
            <ReactPlayer
              width='100%'
              height='100%'
              ref={videoRef}
              url={details ? details.url : undefined}
              playing={playing}
              onProgress={handleProgress}
              controls
            />
            {loading ? 'loading...' : null}
            {details ? JSON.stringify(details) : null}
          </Box>
        </Box>
        <HStack mt={4}>
          <Button onClick={() => setPlaying(true)}>Play</Button>
          <Button onClick={() => setPlaying(false)}>Pause</Button>
          <Button onClick={() => handleSeek(194)}>Go to 03:14</Button>
        </HStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
