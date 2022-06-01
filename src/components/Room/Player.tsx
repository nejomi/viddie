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
    if (isPlaying) {
      videoRef.current.play();
    }

    // initial seek, dont emit this
    setDontEvent(true);
    videoRef.current.currentTime = currentTime;
    setDontEvent(false);

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

    return () => {
      socket.removeListener('update video');
    }
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

    // TODO: seeking cause playing bug fix it in the future
    console.log('EMIT SEEK');
    socket.emit('seek video', videoRef.current.currentTime);
  };

  return (
    <Box d='flex' w='full' h='100vh' alignItems='center' justifyContent='center'>
      <Box w='full' h='full'>
        <video
          src={filepath}
          id='player'
          ref={videoRef}
          style={{ backgroundColor: 'black', width: '100%', height: '100%'}}
          controls
          controlsList='noplaybackrate nodownload'
          disablePictureInPicture
          muted={true}
          preload='auto'
          onWaiting={() => console.log('waiting')}
          onStalled={() => console.log('stalled')}
          onSeeked={handleSeek}
          onPlay={handlePlay}
          onPause={handlePause}
        ></video>
      </Box>
    </Box>
  );
};

export default Player;
