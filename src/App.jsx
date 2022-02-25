import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Room from './pages/Room';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/room">
          <Route path="not-found" element={<h1>Não existe nenhuma sala com esse ID</h1>} />
          <Route path=":id" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
