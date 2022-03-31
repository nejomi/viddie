import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useVideo } from '../../hooks/useVideo';
import { Magnet } from '../../types/Types';
import socket from '../../utils/socket';
import Plyr from 'plyr';

interface VideoProps {
  magnet: Magnet;
}

const Video = ({ magnet }: VideoProps) => {
  const { video } = useVideo(magnet);
  const videoRef = useRef<HTMLVideoElement>(null!);
  const [dontEvent, setDontEvent] = useState(false);
  const [player, setPlayer] = useState<Plyr>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!video) {
      return;
    }

    setLoading(true);
    setPlayer(
      new Plyr(document.getElementById('player')!, {
        settings: [],
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'settings',
          'fullscreen',
        ],
      })
    );

    video.renderTo('video#player', (err, elem) => {
      if (err) throw err;

      socket.on('update video', ({ type, time }) => {
        setDontEvent(true);
        if (!player) {
          return;
        }

        switch (type) {
          case 'PLAY':
            console.log('PLAY EVENT');
            videoRef.current.play();
            break;
          case 'SEEK':
            console.log('SEEK EVENT TO', time);
            player.currentTime = time;
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
    });
  }, [video]);

  if (!magnet) {
    return <div>Waiting for host to upload...</div>;
  }

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

  return (
    <Box
      d='flex'
      w='full'
      h='auto'
      alignItems='center'
      justifyContent='center'
      bg='black'
    >
      {loading && (
        <Box
          w='full'
          maxW='1280px'
          height='720px'
          d='flex'
          justifyContent='center'
          alignItems='center'
          fontWeight='semibold'
          fontSize='xl'
        >
          Getting torrent details...
        </Box>
      )}
      <Box w='full' maxW='1366px' d={loading ? 'none' : 'block'}>
        <video
          id='player'
          ref={videoRef}
          controls
          width='100%'
          controlsList='noplaybackrate'
          disablePictureInPicture
          muted={true}
          onWaiting={() => console.log('waiting')}
          onStalled={() => console.log('stalled')}
          onLoadedMetadata={() => setLoading(false)}
          onSeeked={handleSeek}
          onPlay={handlePlay}
          onPause={handlePause}
        ></video>
      </Box>
    </Box>
  );
};

export default Video;
