import { useContext, useEffect, useState } from 'react';
import UserContext from '../utils/user-context';
import socket from '../utils/socket';
import { RoomDetails } from '../types/Types';
import { getName } from '../utils/getName';
import { useParams } from 'react-router-dom';

const useRoomSocket = () => {
  const { updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);

  const params = useParams();
  const roomId = params.room!;

  useEffect(() => {
    if (!roomId) throw new Error('No roomId');

    console.log('room use effect');

    function initSockets() {
      socket.emit('join room', roomId);

      socket.on('room not found', () => {
        setLoading(false);
        setRoomDetails(null);
      });

      socket.on('joined room', ({ roomDetails, user }) => {
        document.title = user.type;
        updateUser(user);
        setRoomDetails(roomDetails);
        setLoading(false);
      });

      socket.on('magnet updated', (magnet) => {
        // update magnet
        setRoomDetails((prevDetails) => {
          return {...prevDetails, magnet}
        });
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
    roomDetails,
  };
};

export default useRoomSocket;
