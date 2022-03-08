import {
  Divider,
  Grid,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Home from './Home';

export default function RoomEnded() {
  const toast = useToast();

  useEffect(() => {
    toast.closeAll();
  }, []);

  return (
    <Grid maxWidth="container.lg" justifyContent="center" minHeight="100vh" padding={8} margin="0 auto" gap={4}>
      <Heading alignSelf="end">Essa sala foi finalizada</Heading>
      <Text>Experimente criar uma nova ou entrar em outra já existente.</Text>
      <Divider />
      <Home />
    </Grid>
  );
}
