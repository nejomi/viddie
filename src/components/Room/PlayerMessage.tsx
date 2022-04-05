import { AspectRatio, Box } from '@chakra-ui/react';
import React from 'react';

const PlayerMessage = () => {
  return (
    <AspectRatio w='full' maxW='1366px' ratio={16 / 9}>
      <Box
        w='full'
        d='flex'
        justifyContent='center'
        alignItems='center'
        fontWeight='semibold'
        fontSize='xl'
      >
        Loading
      </Box>
    </AspectRatio>
  );
};

export default PlayerMessage;
