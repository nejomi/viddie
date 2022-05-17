import { Box, Flex } from '@chakra-ui/react';
import { VideoDetails } from '../../types/Types';
import Player from './Player';

const Video = ({ details } : { details: VideoDetails}) => {
  // yooo
  return (
    <Flex w='full' h='full' flexDir='column'>
      {/* If no more details to put under, just make it full screen and move Player code here */}
      <Player isPlaying={details.isPlaying} currentTime={details.currentTime}/>
    </Flex>
  );
};

export default Video;
