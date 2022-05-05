import { AspectRatio, Box } from '@chakra-ui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import socket from '../../utils/socket';
import Plyr from 'plyr';
import plyrConfig from '../../utils/plyrConfig';
import { type TorrentFile } from 'webtorrent';
import { type VideoStatus } from '../../types/Types';

interface PlayerProps {
  status: VideoStatus;
  onVideoLoaded: () => void;
}

const Player = ({ status, onVideoLoaded }: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [dontEvent, setDontEvent] = useState(false);

  useEffect(() => {
    new Plyr(document.getElementById('player')!, plyrConfig);

    socket.on('update video', ({ type, time }) => {
      setDontEvent(true);
      switch (type) {
        case 'PLAY':
          console.log('PLAY EVENT');
          videoRef.current.play();
          break;
        case 'SEEK':
          console.log('SEEK EVENT TO', time);
          videoRef.current.currentTime = time;
          break;
        case 'PAUSE':
          console.log('PAUSE EVENT');
          if (time - videoRef.current.currentTime > 3) {
            videoRef.current.currentTime = time;
          }
          videoRef.current.pause();
          break;
        default:
          throw new Error(`Video event doesn't exist`);
      }
    });
  }, []);

  const handlePause = () => {
    // not really paused while seeking
    if (videoRef.current.seeking) return;
    if (dontEvent) return setDontEvent(false);

    console.log('EMIT PAUSE');
    socket.emit('pause video', videoRef.current.currentTime);
  };

  const handlePlay = () => {
    // not really played while seeking
    if (videoRef.current.seeking || !videoRef.current.paused) return;
    if (dontEvent) return setDontEvent(false);

    console.log('EMIT PLAY');
    socket.emit('play video', videoRef.current.currentTime);
  };

  const handleSeek = () => {
    if (dontEvent) return setDontEvent(false);

    console.log('EMIT SEEK');
    socket.emit('seek video', videoRef.current.currentTime);
  };

  const handleVideoLoaded = () => {
    onVideoLoaded();
  };

  return (
    <Box
      d='flex'
      w='full'
      h='auto'
      alignItems='center'
      justifyContent='center'
      bg='black'
    >
      <Box w='full' maxW='1366px' d={status === 'DONE' ? 'block' : 'none'}>
        <iframe
          width='640'
          height='360'
          src='https://mega.nz/embed/u5tDGD6D#SaASGxtVeGRhHY4X44O4SfhoZSRVoMzYeRiI2SvpVZI'
        ></iframe>
        <video
          src='https://mega.nz/file/u5tDGD6D#SaASGxtVeGRhHY4X44O4SfhoZSRVoMzYeRiI2SvpVZI'
          id='player'
          ref={videoRef}
          controls
          width='100%'
          controlsList='noplaybackrate'
          disablePictureInPicture
          muted={true}
          preload='auto'
          onWaiting={() => console.log('waiting')}
          onStalled={() => console.log('stalled')}
          onLoadedMetadata={handleVideoLoaded}
          onSeeked={handleSeek}
          onPlay={handlePlay}
          onPause={handlePause}
        ></video>
      </Box>
    </Box>
  );
};

export default Player;
