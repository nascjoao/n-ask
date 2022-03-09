import {
  Grid,
  Divider,
  Heading,
  Text,
  Flex,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import Home from './Home';

export default function NotFound() {
  return (
    <Flex minHeight="100vh" padding={8}>
      <Grid
        maxWidth="container.lg"
        width="100%"
        alignItems="center"
        margin="auto"
        gap={8}
        gridTemplateColumns={['auto', 'auto', 'auto', 'repeat(3, auto)']}
      >
        <Box>
          <Heading size="4xl">404</Heading>
          <Text fontSize="4xl" lineHeight="shorter" maxWidth="sm">Parece que essa página não existe.</Text>
          <Text maxWidth="80" mt={4}>Experimente criar uma nova sala ou entrar em uma já existente.</Text>
        </Box>
        <Divider orientation={useBreakpointValue(['horizontal', 'horizontal', 'horizontal', 'vertical'])} />
        <Home />
      </Grid>
    </Flex>
  );
}
