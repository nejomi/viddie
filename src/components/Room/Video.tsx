import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useVideo } from '../../hooks/useVideo';
import { type Magnet, type VideoStatus } from '../../types/Types';
import Player from './Player';

interface VideoProps {
  magnet: Magnet;
}

const Video = ({ magnet }: VideoProps) => {
  const [status, setStatus] = useState<VideoStatus>('NO MAGNET');
  const { video, details, loadingTorrent } = useVideo(magnet);

  useEffect(() => {
    if (!magnet) return setStatus('NO MAGNET');
    console.log(magnet);

    console.log('VIDEO EFFECT');
    return loadingTorrent
      ? setStatus('LOADING TORRENT')
      : setStatus('LOADING VIDEO');
  }, [magnet, loadingTorrent]);

  const handleVideoLoaded = () => {
    setStatus('DONE');
  };

  console.log(details);

  return (
    <Flex w='full' h='full' flexDir='column'>
      <Player video={video} onVideoLoaded={handleVideoLoaded} status={status} />
      <Box h='full'></Box>
    </Flex>
  );
};

export default Video;
