import {
  Box,
  Flex,
  Heading,
  Icon,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import socket from '../../utils/socket';
import ChatMessage from './ChatMessage';
import { Message } from '../../types/Types';
import UserContext from '../../utils/user-context';
import { FaCrown } from 'react-icons/fa';

interface ChatProps {
  onSendMessage: (m: string) => void;
}

const Chat = ({ onSendMessage }: ChatProps) => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('new message', (message) => {
      setMessages((currentMessages) => [
        ...currentMessages,
        { from: message.from, id: message.id, body: message.body },
      ]);
    });

    return () => {
      socket.off('new message');
    };
  }, []);

  useEffect(() => {
    const scrollToEnd = () => {
      if (!endOfChatRef.current) {
        throw Error('No end of chat ref');
      }

      // always scrolls to end on messages update
      // shouldnt scroll when scroll not on end (user scrolled up)
      endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    scrollToEnd();
  }, [messages]);

  function handleKeyDown(e: React.KeyboardEvent) {
    // check if enter for send message
    if (e.key === 'Enter' && message) {
      // get time and convert to string
      const id = new Date().getTime().toString();

      onSendMessage(message);
      setMessages([...messages, { from: user.name, body: message, id: id }]);
      setMessage('');
    }
  }

  return (
    <Box w='sm' h='100vh' bg='gray.50' boxShadow='sm'>
      <Flex h='full' flexDirection='column'>
        <Box d='flex' flexDirection='column' flexGrow={1} minHeight={0} p={3}>
          <Box>
            <Heading size='lg' color='gray.800'>
              Viddie
            </Heading>
            <Flex color='gray.500' fontSize='sm'>
              <Text mr={1}>Your name is </Text>
              <Flex alignItems='center'>
                {user.type === 'host' && <Box as='span' mr={1}>👑</Box> }
                {user.name}
              </Flex>
            </Flex>
          </Box>
          {/* Messages */}
          <Flex h='full' overflowY='auto' flexDirection='column'>
            <Box marginTop='auto' />
            {messages.map((m) => (
              <ChatMessage key={m.id} from={m.from} body={m.body} />
            ))}
            <Box ref={endOfChatRef} />
          </Flex>
        </Box>
        {/* Message Box */}
        <Box h='60px' mx={2} borderTop='1px' borderColor='gray.300'>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            variant='unstyled'
            pt={2}
            mb={6}
            fontSize='16px'
            borderRadius={0}
            placeholder='Type a message...'
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Chat;
