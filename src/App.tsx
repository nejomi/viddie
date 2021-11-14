import { Box, ChakraProvider, Heading } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/alert';
import { useLoading } from './hooks/useLoading';
import { VideoDetails } from './types/Video';
import { getVideoDetails } from './utils/getVideoDetails';

function App() {
  const [details, setDetails] = useState<VideoDetails | null>(null);
  const [loading, toggleLoading] = useLoading(false);
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
      // loading
      toggleLoading();
      const file = files[0];

      try {
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

        // remove selected file
        if (fileRef.current) {
          fileRef.current.value = '';
        }
      }
      toggleLoading();
    }
  }

  if (details) {
    console.log(details.url);
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
      </Box>
    </ChakraProvider>
  );
}

export default App;
