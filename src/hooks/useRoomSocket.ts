import { useContext, useEffect, useState } from 'react';
import UserContext from '../utils/user-context';
import socket from '../utils/socket';
import { VideoDetails } from '../types/Types';
import { getName } from '../utils/getName';
import FilepathContext from '../utils/filepath-context';
import { useNavigate } from 'react-router-dom';

const useRoomSocket = (roomId: string) => {
  const { updateUser } = useContext(UserContext);
  const { filepath } = useContext(FilepathContext);
  const [loading, setLoading] = useState(true);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // no filepath, go to join
    if (!filepath) {
      navigate('/join/' + roomId);
      return;
    }

    const initSockets = () => {
      console.log('INIT SOCKETS');
      socket.emit('join room', roomId);

      socket.on('room not found', () => {
        setLoading(false);
        setVideoDetails(null);
      });

      socket.on('joined room', ({ videoDetails, user }) => {
        console.log('Got video details.');
        document.title = user.type;
        updateUser(user);
        setVideoDetails(videoDetails);
        setLoading(false);
      });
    }

    // cleanup function
    const cleanUp = () => {
      console.log('Cleanup disconnecting sockets.');
      socket.disconnect();
    }

    // room host already connected
    if (socket.connected) {
      initSockets();
      return cleanUp;
    }

    // connect
    const randName = getName();
    socket.auth = { username: randName };
    socket.connect();

    socket.on('connect', () => {
      initSockets();
    });

    return cleanUp;
  }, [roomId, updateUser, filepath]);

  return {
    loading,
    videoDetails,
  };
};

export default useRoomSocket;
