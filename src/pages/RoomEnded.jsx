import {
  Divider,
  Grid,
  Heading,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import Home from './Home';

export default function RoomEnded() {
  return (
    <Grid maxWidth="container.lg" justifyContent="center" minHeight="100vh" padding={8} margin="0 auto" gap={4}>
      <Heading alignSelf="end">Essa sala foi finalizada</Heading>
      <Text>Experimente criar uma nova ou entrar em outra já existente.</Text>
      <Divider />
      <Home />
    </Grid>
  );
}
