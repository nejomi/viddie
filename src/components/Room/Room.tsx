import { Box, Heading, Flex } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import UserContext from '../../utils/user-context';
import Chat from './Chat';
import useRoomSocket from '../../hooks/useRoomSocket';
import { useParams } from 'react-router-dom';
import Video from './Video';

function Room() {
  const { user } = useContext(UserContext);
  const params = useParams();
  const { loading, videoDetails } = useRoomSocket(params.room!);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!videoDetails) {
    return <div>Room doesn't exist</div>;
  }

  return (
    <>
      <Flex w='100vw' h='100vh'>
          <Video details={videoDetails}/>
        <Chat />
      </Flex>
    </>
  );
}

export default Room;
