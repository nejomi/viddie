import { Flex } from '@chakra-ui/react';
import Chat from './Chat';
import useRoomSocket from '../../hooks/useRoomSocket';
import { useParams } from 'react-router-dom';
import Video from './Video';

function Room() {
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
      <Flex w='100vw' h='100vh' bg='gray.600'>
          <Video details={videoDetails}/>
        <Chat />
      </Flex>
    </>
  );
}

export default Room;
