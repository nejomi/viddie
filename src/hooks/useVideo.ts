import { useEffect, useState } from 'react';
import type { TorrentFile } from 'webtorrent';
import { Magnet } from '../types/Types';
import client from '../utils/webtorrent-client';

export const useVideo = (magnet: Magnet) => {
  const [video, setVideo] = useState<TorrentFile | null>(null);

  useEffect(() => {
    if (!magnet) {
      return;
    }


    client.add(magnet, function (torrent) {
      // find the first file that ends with .mp4
      const video = torrent.files.find(function (file) {
        return file.name.endsWith('.mp4');
      });

      if (video) {
        setVideo(video);
      } else {
        console.log('No video file');
      }

      return () => {
        client.remove(magnet);
      };
    });
  }, [magnet]);

  return { video }
}