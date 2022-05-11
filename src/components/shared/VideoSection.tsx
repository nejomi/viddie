import { Box, Flex, Text } from '@chakra-ui/react';
import prettyBytes from 'pretty-bytes';
import React from 'react';
import Dropzone from './Dropzone';

const VideoSection = ({
  file,
  onDropAccepted,
}: {
  file: File | undefined;
  onDropAccepted: (files: File[]) => void;
}) => {
  return (
    <Box as='section' mb={4}>
      <Text as='label' d='block' fontWeight='medium' mb={2}>
        Video
      </Text>
      <Dropzone onDropAccepted={onDropAccepted} />
      <Flex fontSize='sm' color='gray.300'>
        {file ? (
          <>
            <Text isTruncated mr={2}>
              {file.name}
            </Text>
            <Text whiteSpace='nowrap'>{`(${prettyBytes(file.size)})`}</Text>
          </>
        ) : (
          <Text>No video selected</Text>
        )}
      </Flex>
    </Box>
  );
};

export default VideoSection;
