import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import socket from '../../utils/socket';
import ChatMessage from './ChatMessage';
import { Message } from '../../types/Types';
import UserContext from '../../utils/user-context';
import { FaShareSquare } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Chat = () => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [shareClicked, setShareClicked] = useState<boolean>(false);
  const endOfChatRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  console.log(location);

  // init chat socket events
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

  // scroll to end on new message
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

  // check if enter to send message
  function handleKeyDown(e: React.KeyboardEvent) {
    // TODO: add delivering / delivered functionality
    if (e.key === 'Enter' && message) {
      socket.emit('send message', message);
      setMessage('');
    }
  }

  const handleCopyClick = () => {
    setShareClicked(true);

    // copy link to clipboard
    navigator.clipboard.writeText(window.location.origin + '/join' + location.pathname );
  };

  const handlePopoverClose = () => {
    // reset message
    // its too fast so need to put timout
    setTimeout(() => {
      setShareClicked(false);
    }, 250);
  };

  return (
    <Box w='full' maxW='xs' h='100vh'>
      <Flex h='full' flexDirection='column'>
        <Box
          p={4}
          d='flex'
          flexDirection='column'
          flexGrow={1}
          minHeight={0}
          bg='blackAlpha.700'
          onClick={handleCopyClick}
        >
          {/* Heading */}
          <Flex justifyContent='space-between'>
            <Flex alignItems='center'>
              <Heading fontSize={24}>Viddie </Heading>
              <Popover trigger='hover' onClose={handlePopoverClose}>
                <PopoverTrigger>
                  <Button variant='ghost' ml={2} p={0} size='md'>
                    <Icon as={FaShareSquare} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  w='max-content'
                  bgColor={shareClicked ? 'green.500' : 'gray.600'}
                >
                  <PopoverArrow
                    bgColor={shareClicked ? 'green.600' : 'gray.700'}
                  />
                  <PopoverBody fontWeight='semibold'>
                    {shareClicked ? 'Copied to clipboard!' : 'Copy link'}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            <Flex
              alignItems='center'
              color='gray.300'
              fontSize='md'
              fontWeight='semibold'
            >
              <Flex alignItems='center'>
                {user.type === 'host' && (
                  <Box as='span' mr={1}>
                    👑
                  </Box>
                )}
                {user.name}
              </Flex>
            </Flex>
          </Flex>
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
        <Box h='60px' px={2} py={1} bg='blackAlpha.800'>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            variant='unstyled'
            pt={2}
            mb={6}
            fontSize='16px'
            borderRadius={0}
            placeholder='Send a message...'
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Chat;
