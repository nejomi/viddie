import { Box, Text } from '@chakra-ui/react';

const AlertMessage = ({ message }: { message: string }) => {
  return (
    <Box w='full' my={1}>
      <Text color='#6d7074'>{message}</Text>
    </Box>
  );
};

export default AlertMessage;
