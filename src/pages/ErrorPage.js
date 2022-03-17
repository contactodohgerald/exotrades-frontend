import { Button, Center, Heading, Image, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <SimpleGrid
      columns={{ sm: 1, md: 1 }}
      rounded='lg'
      mt='10em'
    >
      <Link to='/'>
        <Center>
          <Image mb='5' src="https://image.shutterstock.com/image-photo/classical-music-collage-600w-103257545.jpg" borderRadius="full"   alt="Logo" width="80px" height="80px" />
        </Center>
        <Heading as='h1' size='4xl' textAlign='center'>404</Heading>
        <Text textAlign='center' fontSize='4xl' mt='5' mb='10'>The page you were looking for could not be found. </Text>
        <Center>
          <Link to='/'>
            <Button textAlign='center' size='md' border='2px'>Back To Home</Button>
          </Link>
        </Center>
      </Link>
    </SimpleGrid>
  );
}

export default ErrorPage;
