import { Box } from '@chakra-ui/react';

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
  };

  return (
    <Box
      d='flex'
      w='full'
      my={1}
      alignItems='flex-start'
      color='whiteAlpha.700'
    >
      <Box mr={2} color='white' fontWeight='semibold'>
        {from}
      </Box>
      <p>
        {words.map((word, i) => {
          const bold = checkIfNeedsBold(word);

          return bold ? (
            <>
              <Box as='span' key={word + i} fontWeight='bold' whiteSpace='pre'>
                {removeAsterisks(word)}
              </Box>{' '}
            </>
          ) : (
            `${word} `
          );
        })}
      </p>
    </Box>
  );
};

export default ChatMessage;
