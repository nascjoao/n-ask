import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import '@fontsource/inter';

export default function ThemeProvider({ children }) {
  const theme = extendTheme({
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    config: {
      initialColorMode: 'dark',
    },
  });

  return (
    <ChakraProvider theme={theme}>
      { children }
    </ChakraProvider>
  );
}
