import { Center, Flex, Link, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Button from './shared/Button';
import MainLayout from '../layouts/MainLayout';

const Main = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate('/create');
  };

  return (
    <MainLayout>
      <Center h='full' alignItems='center' p={8}>
        <Flex flexDir='column' h='full'>
          <Text fontSize='2xl' fontWeight='semibold' mb={4}>
            Thanks for trying out my application!{' '}
          </Text>
          <Text fontSize='lg' mb={4}>
            If you find any issues or if you have a suggestion, please message
            me on discord.
          </Text>
          <Link
            fontSize='lg'
            fontWeight='semibold'
            mb={14}
            href='https://volume-internet-destination-durock-elementary.notion.site/Roadmap-ef7c028132274b49b84f6a0df1531719'
            isExternal
          >
            🛣️ Roadmap
          </Link>
          <Button
            colorScheme='blue'
            size='lg'
            mb={8}
            onClick={handleCreateRoom}
          >
            Create Room
          </Button>
        </Flex>
      </Center>
    </MainLayout>
  );
};

export default Main;
