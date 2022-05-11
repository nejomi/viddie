import { useContext, useEffect, useState } from 'react';
import UserContext from '../utils/user-context';
import socket from '../utils/socket';
import { VideoDetails } from '../types/Types';
import { getName } from '../utils/getName';

const useRoomSocket = (roomId: string) => {
  const { updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

  useEffect(() => {
    function initSockets() {
      socket.emit('join room', roomId);

      socket.on('room not found', () => {
        setLoading(false);
        setVideoDetails(null);
      });

      socket.on('joined room', ({ videoDetails, user }) => {
        document.title = user.type;
        updateUser(user);
        setVideoDetails(videoDetails);
        setLoading(false);
      });
    }

    // room host already connected
    if (socket.connected) {
      initSockets();
      return;
    }

    // connect
    const randName = getName();
    socket.auth = { username: randName };
    socket.connect();

    socket.on('connect', () => {
      initSockets();
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, updateUser]);

  return {
    loading,
    videoDetails
  };
};

export default useRoomSocket;
