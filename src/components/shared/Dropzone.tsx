import { Box, Flex, Icon, Text, useToast, } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { HiDocumentAdd } from 'react-icons/hi';

interface DropzoneProps {
  onDropAccepted: (files: File[]) => void;
}

const Dropzone = ({ onDropAccepted }: DropzoneProps) => {
  const toast = useToast();
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: 'video/mp4',
    onDropAccepted: onDropAccepted,
    onDropRejected: () => {
      toast({
        title: 'File not supported',
        description: 'Please select one (1) mp4 file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return (
    <Box
      w='full'
      h='160px'
      bg='gray.600'
      borderRadius='lg'
      border='2px'
      mb={2}
      borderStyle='dashed'
      borderColor='gray.400'
      _hover={{
        borderColor: 'blue.500',
      }}
      p={4}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Flex
        h='full'
        alignItems='center'
        justifyContent='center'
        flexDir='column'
      >
        <Icon as={HiDocumentAdd} boxSize={8} color='blue.200' mb={2}/>
        <Text fontSize='sm'>Click or drag your mp4 video here</Text>
      </Flex>
    </Box>
  );
};

export default Dropzone;
