import { Box, Flex, Text } from '@chakra-ui/react';

interface MessageProps {
  from: string;
  body: string;
}

const ChatMessage = ({ from, body }: MessageProps) => {
  return (
    <Box w='full' my={1} alignItems='flex-start'>
      <Text>
        <Box as='span' mr={2} color='vd-gray.300' fontWeight='semibold'>
          {from}
        </Box>
        {body}
      </Text>
    </Box>
  );
};

export default ChatMessage;
