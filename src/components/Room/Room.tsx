import { Box, Heading, Flex } from '@chakra-ui/react';
import  { useContext } from 'react';
import UserContext from '../../utils/user-context';
import Chat from './Chat';
import useRoomSocket from '../../hooks/useRoomSocket';
import { useNavigate, useParams } from 'react-router-dom';
import FilepathContext from '../../utils/filepath-context';
import Video from './Video';

function Room() {
  const { user } = useContext(UserContext);
  const params = useParams();
  const { loading, videoDetails } = useRoomSocket(params.room!);
  const { filepath } = useContext(FilepathContext);
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!filepath) {
    navigate('/join/' + params.room);
  }

  if (!videoDetails) {
    return <div>Room doesn't exist</div>;
  }

  return (
    <>
      <Flex w='100vw' h='100vh' bg='bg.regular'>
        <Box w='full' h='full'>
          <Video />
        </Box>
        <Chat />
      </Flex>
    </>
  );
}

export default Room;
