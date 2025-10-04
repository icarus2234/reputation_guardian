import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Mentions from './pages/Mentions';
import Analytics from './pages/Analytics';
import Responses from './pages/Responses';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentions" element={<Mentions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/responses" element={<Responses />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Box>
  );
};

export default App;
