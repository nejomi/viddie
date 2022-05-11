import { Flex, Progress, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import { VerifyingStatus } from '../../types/Types';
import verifyingMessages from '../../utils/verifyingMessages';

const VerifyOverlay = ({
  status,
  hashProgress,
  closeOnDone
}: {
  status: VerifyingStatus;
  hashProgress: number;
  closeOnDone?: boolean
}) => {
 
  if (status === 'WAITING') {
    return null;
  }

  if (status === 'DONE' && closeOnDone) {
    return null;
  }

  return (
    <Flex
      w='full'
      h='full'
      bg='gray.700'
      zIndex='10'
      position='absolute'
      top='0'
      left='0'
      bgColor='rgba(23,25,35,0.95)'
      flexDir='column'
      alignItems='center'
      justifyContent='center'
      borderRadius='inherit'
    >
      <Spinner mb={1} />
      <Text fontWeight='semibold' mb={2}>
        { verifyingMessages[status]}
      </Text>
      {status === 'HASHING FILE' && (
        <Progress value={hashProgress} w='52' hasStripe size='lg' />
      )}
    </Flex>
  );
};

export default VerifyOverlay;
