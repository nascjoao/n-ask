import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SingleEvent from './pages/SingleEvent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/event/:id" element={<SingleEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
