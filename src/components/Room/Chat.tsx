import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import socket from '../../utils/socket';
import ChatMessage from './ChatMessage';
import { Event, Message } from '../../types/Types';
import UserContext from '../../utils/user-context';
import { FaShareSquare } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import AlertMessage from './AlertMessage';
import './Messages.css';

const Chat = () => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState<(Message | Event)[]>([]);
  const [message, setMessage] = useState<string>('');
  const [shareClicked, setShareClicked] = useState<boolean>(false);
  const endOfChatRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // init chat socket events
  useEffect(() => {
    socket.on('new message', (message) => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          from: message.from,
          id: message.id,
          body: message.body,
          type: 'message',
        },
      ]);
    });

    socket.on('new event', ({ event }) => {
      setMessages((currentMessages) => [...currentMessages, event]);
    });

    return () => {
      socket.off();
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
      e.preventDefault();
      socket.emit('send message', message);
      setMessage('');
    }
  }

  const handleCopyClick = () => {
    setShareClicked(true);

    // copy link to clipboard
    navigator.clipboard.writeText(
      window.location.origin + '/join' + location.pathname
    );
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
      <Flex h='full' flexDirection='column' bg='blackAlpha.700'>
        <Box
          p={4}
          d='flex'
          flexDirection='column'
          flexGrow={1}
          minHeight={0}
          onClick={handleCopyClick}
        >
          {/* Heading */}
          <Flex justifyContent='space-between' mb={4}>
            <Flex alignItems='center'>
              <Heading fontSize={24} color='blue.400'>Viddie </Heading>
              <Popover trigger='hover' onClose={handlePopoverClose}>
                <PopoverTrigger>
                  <Button variant='ghost' ml={2} p={0} size='sm' color='gray.300'>
                    <Icon as={FaShareSquare} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  w='max-content'
                  bgColor={shareClicked ? 'green.500' : 'gray.600'}
                  fontSize='sm'
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
          <Flex id='messages' h='full' overflowY='auto' flexDirection='column'>
            <Box marginTop='auto' />
            {messages.map((m) =>
              m.type === 'message' ? (
                <ChatMessage key={m.id} from={m.from} body={m.body} />
              ) : (
                <AlertMessage key={m.id} message={m.message} />
              )
            )}
            <Box ref={endOfChatRef} />
          </Flex>
        </Box>
        {/* Message Box */}
        <Box px={4} pb={8}>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            h='80px'
            px={2}
            resize='none'
            placeholder='Send a message...'
            color='whiteAlpha.700'
            bgColor='whiteAlpha.50'
            _focus={{
              borderColor: 'none'
            }}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Chat;
