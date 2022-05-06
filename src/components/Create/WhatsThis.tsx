import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Text,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from '@chakra-ui/react';

const WhatsThis = () => {
  return (
    <Popover trigger='hover' placement='top'>
      <PopoverTrigger>
        <Box
          as='span'
          fontSize='xs'
          color='gray.400'
          ml={2}
          fontWeight='regular'
          cursor='default'
        >
          What is this?
        </Box>
      </PopoverTrigger>
      <PopoverContent bg='blue.800'>
        <PopoverArrow />
        <PopoverBody fontSize='sm' fontWeight='normal'>
          <Text mb={2}>
            Generate the MD5 Checksum for each user to verify they have the same video. Viddie will only verify video length and size without this enabled.
          </Text>
          <Text>This might take a while for bigger files.</Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default WhatsThis;
