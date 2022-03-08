import { Flex } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Identification from './pages/Identification';
import Room from './pages/Room';
import RoomEnded from './pages/RoomEnded';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={(
            <Flex minHeight="100vh" alignItems="center" justifyContent="center">
              <Home />
            </Flex>
        )}
        />
        <Route path="/room">
          <Route path="ended" element={<RoomEnded />} />
          <Route path="identification" element={<Identification />} />
          <Route path="not-found" element={<h1>Não existe nenhuma sala com esse ID</h1>} />
          <Route path=":id" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
