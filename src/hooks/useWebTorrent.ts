import { useState, useEffect } from 'react';
import axios from 'axios';
import WebTorrent from 'webtorrent';

const URL = 'http://localhost:5000/__rtcConfig__';

// put types here
const useWebTorrent = () => {
  const [client, setClient] = useState<WebTorrent.Instance | null>(null);

  useEffect(() => {
    const getRTC = async () => {
      const { data } = await axios.get(URL);
      const rtcConfig = data.rtcConfig;

      console.log(rtcConfig);
      setClient(
        new WebTorrent({
          tracker: {
            rtcConfig: {
              iceServers: [
                {
                  urls: 'stun:openrelay.metered.ca:80',
                },
                {
                  urls: 'turn:openrelay.metered.ca:80',
                  username: 'openrelayproject',
                  credential: 'openrelayproject',
                },
                {
                  urls: 'turn:openrelay.metered.ca:443',
                  username: 'openrelayproject',
                  credential: 'openrelayproject',
                },
                {
                  urls: 'turn:openrelay.metered.ca:443?transport=tcp',
                  username: 'openrelayproject',
                  credential: 'openrelayproject',
                },
              ],
            },
            sdpSemantics: 'unified-plan',
            bundlePolicy: 'max-bundle',
            iceCandidatePoolsize: 1,
          },
        })
      );
    };

    getRTC();
  }, []);

  console.log(client);
  return client;
};

export default useWebTorrent;
