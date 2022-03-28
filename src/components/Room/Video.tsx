import { useEffect, useState } from 'react';
import WebTorrent from 'webtorrent';
import { client } from '../../utils/webtorrent-client';

interface VideoProps {
  client: WebTorrent.Instance;
  magnet: string | null;
}

const Video = ({ magnet }: VideoProps) => {
  const [loading, setLoading] = useState(false);

  // magnet updated, update video
  // TODO:
  // 1. move this to room and just pass file as props if u cant renderto here
  // 2. this function is too long create a helper function like getFileFromMagnet() or useVideo(magnet) => file

  useEffect(() => {
    if (!magnet) {
      return;
    }

    setLoading(true);

    client.add(magnet, function (torrent) {
      // find the first file that ends with .mp4
      var file = torrent.files.find(function (file) {
        return file.name.endsWith('.mp4');
      });

      if (file) {
        console.log(file);
        setLoading(false);
        file.renderTo('video#player', (err, elem) => {
          if (err) throw err;
        });
      } else {
        console.log('nope');
      }

      return () => {
        console.log('removing?');
        client.remove(magnet);
      };
    });
  }, [magnet]);

  if (!magnet) {
    return <div>Waiting for host to upload...</div>;
  }

  return (
    <>
      {!loading ? (
        <video
          id='player'
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
