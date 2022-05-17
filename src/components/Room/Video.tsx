import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { VideoDetails, type VideoStatus } from '../../types/Types';
import Player from './Player';

const Video = ({ details } : { details: VideoDetails}) => {
  // yooo
  return (
    <Flex w='full' h='full' flexDir='column'>
      <Player isPlaying={details.isPlaying} currentTime={details.currentTime}/>
      <Box h='full'></Box>
    </Flex>
  );
};

export default Video;
