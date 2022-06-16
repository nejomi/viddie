import { Box, Text } from '@chakra-ui/react';

interface MessageProps {
  from: string;
  body: string;
}

const ChatMessage = ({ from, body }: MessageProps) => {
  // TODO: this only bolds single words ex: **hello** but not **hello world**
  const words: string[] = body.split(' ');

  const checkIfNeedsBold = (word: string) => {
    const length = word.length;

    // invalidates double asterisk
    if (length < 5) {
      return false;
    }

    const asteriskLocations = [
      word[0],
      word[1],
      word[length - 2],
      word[length - 1],
    ];

    const bold = asteriskLocations.every((a) => a === '*');
    return bold;
  };

  const removeAsterisks = (word: string) => {
    return word.replace(/\*/g, '');
  }

  return (
    <Box w='full' my={1} alignItems='flex-start'>
      <Text>
        <Box as='span' mr={2} color='gray.400' fontWeight='semibold'>
          {from}
        </Box>
        {words.map((word, i) =>
          checkIfNeedsBold(word) ? (
            <Box key={word + i} as='span' fontWeight='bold'>
              {removeAsterisks(word) + ' '}
            </Box>
          ) : 
          `${word} ` 
        )}
      </Text>
    </Box>
  );
};

export default ChatMessage;
