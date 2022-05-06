import socket from '../utils/socket';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const useOnConnect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('connect', () => {
      socket.on('room created', ({ room }) => {
        navigate(`/${room}`);
      });
    });

    return () => {
      socket.off();
    };
  }, [navigate]);
}

export default useOnConnect