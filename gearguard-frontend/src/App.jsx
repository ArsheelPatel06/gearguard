import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import KanbanBoard from './pages/KanbanBoard';
import CreateRequest from './pages/CreateRequest';
import Equipment from './pages/Equipment';
import Calendar from './pages/Calendar';
import Teams from './pages/Teams';
import EquipmentDetail from './pages/EquipmentDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<KanbanBoard />} />
          <Route path="create-request" element={<CreateRequest />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="equipment/:id" element={<EquipmentDetail />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="teams" element={<Teams />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
