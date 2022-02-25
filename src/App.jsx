import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SingleEvent from './pages/SingleEvent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/room">
          <Route path="not-found" element={<h1>Não existe nenhuma sala com esse ID</h1>} />
          <Route path=":id" element={<SingleEvent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
