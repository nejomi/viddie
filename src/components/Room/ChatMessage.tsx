import { Flex, Text } from '@chakra-ui/react';

interface MessageProps {
  from: string;
  body: string;
}

const ChatMessage = ({ from, body }: MessageProps) => {
  return (
    <Flex w='full' my={2} flexDirection='column' alignItems='flex-start'>
      <Text fontWeight='semibold' fontSize='sm'>
        {from}
      </Text>
      <Text color='gray.700'>{ body }</Text>
    </Flex>
  );
};

export default ChatMessage;
