import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { type Magnet, type VideoStatus } from '../../types/Types';
import Player from './Player';

const Video = () => {
  const [status, setStatus] = useState<VideoStatus>('NO MAGNET');

  const handleVideoLoaded = () => {
    setStatus('DONE');
  };

  return (
    <Flex w='full' h='full' flexDir='column'>
      <Player onVideoLoaded={handleVideoLoaded} status={status} />
      <Box h='full'></Box>
    </Flex>
  );
};

export default Video;
