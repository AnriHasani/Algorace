import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import LandingPage from './pages/LandingPage.tsx';
import CompetitionLobby from './pages/CompetitionLobby.tsx';
import CodingInterface from './pages/CodingInterface.tsx';
import ResultsPage from './pages/ResultsPage.tsx';
import { AppProvider } from './context/AppContext.tsx';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/lobby/:roomId" element={<CompetitionLobby />} />
            <Route path="/coding/:roomId" element={<CodingInterface />} />
            <Route path="/results/:roomId" element={<ResultsPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;