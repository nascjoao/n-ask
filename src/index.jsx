import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserProvider } from './contexts/User';
import ThemeProvider from './theme/ThemeProvider';

ReactDOM.render(
  <ThemeProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);
