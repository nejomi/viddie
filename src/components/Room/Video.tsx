import { useEffect, useRef } from 'react';
import { useVideo } from '../../hooks/useVideo';
import { Magnet } from '../../types/Types';

interface VideoProps {
  magnet: Magnet;
}

const Video = ({ magnet }: VideoProps) => {
  const { retrievingVideo, video } = useVideo(magnet);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video) {
      return;
    }

    video.renderTo('video#player', (err, el) => {
      if (err) throw err;
      console.log(el);
    });
  }, [video]);

  if (!magnet) {
    return <div>Waiting for host to upload...</div>;
  }

  return (
    <>
      {!retrievingVideo ? (
        <video
          id='player'
          ref={videoRef}
          width='100%'
          controlsList='noplaybackrate'
          disablePictureInPicture
          onWaiting={() => console.log('waiting')}
          onStalled={() => console.log('stalled')}
          onPlaying={() => console.log('playing')}
        ></video>
      ) : (
        <div>Getting torrent details...</div>
      )}
    </>
  );
};

export default Video;
