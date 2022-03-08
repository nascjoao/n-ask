import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Spinner
        size="xl"
      />
    </Flex>
  );
}
