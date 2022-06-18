import { Box } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import socket from '../../utils/socket';
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
  const [loading, setLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null!);
  const { filepath } = useContext(FilepathContext);

  useEffect(() => {
    // initial play
    if (isPlaying) {
      videoRef.current.play();
    }

    // initial seek
    videoRef.current.currentTime = currentTime;

    socket.on('update video', ({ type, time }) => {
      setDontEvent(true);
      switch (type) {
        case 'PLAY':
          console.log('PLAY EVENT');
          console.log(videoRef.current.paused);
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
    };
  }, [isPlaying, currentTime]);

  const handlePause = () => {
    console.log('pause', loading, dontEvent);
    // seeking event triggers pause
    if (videoRef.current.seeking || loading) return;

    if (dontEvent) return setDontEvent(false);

    console.log('EMIT PAUSE');
    socket.emit('pause video', videoRef.current.currentTime);
  };

  const handlePlay = () => {
    console.log('play', loading, dontEvent);
    // seeking event triggers play
    if (videoRef.current.seeking || loading) return;
    if (dontEvent) return setDontEvent(false);

    console.log('EMIT PLAY');
    socket.emit('play video', videoRef.current.currentTime);
  };

  const handleSeek = () => {
    console.log('seek', loading, dontEvent);
    if (loading) return;
    if (dontEvent) return setDontEvent(false);

    // TODO: seeking cause playing bug fix it in the future
    console.log('EMIT SEEK');
    socket.emit('seek video', videoRef.current.currentTime);
  };

  const handleEnded = () => {
    // on ended, video player doesnt emit play on re-play
    // TODO: everyone will emit this if they all ended at the same time, otherwise only 1 will emit if they end first
    // needs fix
    videoRef.current.currentTime = 0.1;
  };

  const handleLoadedData = async () => {
    console.log('loaded data');
    setLoading(false);
  };

  return (
    <Box
      d='flex'
      w='full'
      h='100vh'
      alignItems='center'
      justifyContent='center'
    >
      <Box w='full' h='full'>
        <video
          src={filepath}
          id='player'
          ref={videoRef}
          style={{ backgroundColor: 'black', width: '100%', height: '100%' }}
          controls
          controlsList='noplaybackrate nodownload'
          disablePictureInPicture
          muted={true}
          preload='auto'
          onWaiting={() => console.log('waiting')}
          onStalled={() => console.log('stalled')}
          onLoadedData={handleLoadedData}
          onSeeked={handleSeek}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
        ></video>
      </Box>
    </Box>
  );
};

export default Player;
