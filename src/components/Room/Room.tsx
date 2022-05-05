import { Box, Heading, Flex } from '@chakra-ui/react';
import React, { useState, useEffect, useContext } from 'react';
import socket from '../../utils/socket';
import UserContext from '../../utils/user-context';
import Chat from './Chat';
import Video from './Video';
import useRoomSocket from '../../hooks/useRoomSocket';
import { createMD5, md5 } from 'hash-wasm';
import { IHasher } from 'hash-wasm/dist/lib/WASMInterface';
import { setSyntheticTrailingComments } from 'typescript';
import useHash from '../../hooks/useHash';

function Room() {
  const { user } = useContext(UserContext);
  const { loading, roomDetails } = useRoomSocket();
  const [file, setFile] = useState<File | null>(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomDetails) {
    return <div>Room doesn't exist</div>;
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.currentTarget.files;

    if (!files || files.length === 0) {
      // handle
      return;
    }

    const file = files[0];

    setFile(file);
  };

  return (
    <>
      <Flex w='100vw' h='100vh' bg='bg.regular'>
        <Box w='full' h='full'>
          <input type='file' onChange={handleFile}></input>
          {/* <Video /> */}
        </Box>
        <Chat />
      </Flex>
    </>
  );
}

export default Room;
