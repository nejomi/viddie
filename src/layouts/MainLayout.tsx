import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Container h='100vh' maxW='md'>
      <Flex
        h='full'
        flexDir='column'
        alignItems='center'
        justifyContent='center'
      >
        <Heading size='3xl' mb={6}>
          Viddie
        </Heading>
        <Box
          bg='bg.lightest'
          h='400px'
          w='full'
          borderRadius='2xl'
          boxShadow='sm'
        >
          {children}
        </Box>
      </Flex>
    </Container>
  );
};

export default MainLayout;
