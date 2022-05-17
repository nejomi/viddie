import { AspectRatio, Box } from '@chakra-ui/react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import socket from '../../utils/socket';
import Plyr from 'plyr';
import plyrConfig from '../../utils/plyrConfig';
import { type TorrentFile } from 'webtorrent';
import { type VideoStatus } from '../../types/Types';
import FilepathContext from '../../utils/filepath-context';

const Player = ({
  isPlaying,
  currentTime,
}: {
  isPlaying: boolean;
  currentTime: number;
}) => {
  // this prevents events from server to trigger client event handlers after just doing them
  const [dontEvent, setDontEvent] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null!);
  const { filepath } = useContext(FilepathContext);

  useEffect(() => {
    new Plyr(document.getElementById('player')!, plyrConfig);

    videoRef.current.currentTime = currentTime;
    if (isPlaying) {
      videoRef.current.play();
    } 

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
          // pausing jumps to the time instead of waiting
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
    // seeking event triggers pause
    if (videoRef.current.seeking) return;

    if (dontEvent) return setDontEvent(false);

    console.log('EMIT PAUSE');
    socket.emit('pause video', videoRef.current.currentTime);
  };

  const handlePlay = () => {
    // seeking event triggers play
    if (videoRef.current.seeking) return;

    if (dontEvent) return setDontEvent(false);

    console.log('EMIT PLAY');
    socket.emit('play video', videoRef.current.currentTime);
  };

  const handleSeek = () => {
    if (dontEvent) return setDontEvent(false);

    console.log('EMIT SEEK');
    socket.emit('seek video', videoRef.current.currentTime);
  };

  const handleProgress = () => {
    console.log(videoRef.current.currentTime);
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
      <Box w='full' maxW='1366px' d='block'>
        <video
          src={filepath}
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
          // onLoadedMetadata={handleVideoLoaded}
          onSeeked={handleSeek}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleProgress}
        ></video>
      </Box>
    </Box>
  );
};

export default Player;
