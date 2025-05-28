import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompetitionProvider } from './context/CompetitionContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompetitionCreatePage from './pages/CompetitionCreatePage';
import CompetitionLobbyPage from './pages/CompetitionLobbyPage';
import CompetitionCodingPage from './pages/CompetitionCodingPage';
import CompetitionResultsPage from './pages/CompetitionResultsPage';

function App() {
  return (
    <AuthProvider>
      <CompetitionProvider>
        <div className="flex flex-col min-h-screen bg-background-primary text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/competition/create" element={<CompetitionCreatePage />} />
              <Route path="/competition/lobby/:roomId" element={<CompetitionLobbyPage />} />
              <Route path="/competition/coding/:roomId" element={<CompetitionCodingPage />} />
              <Route path="/competition/results/:roomId" element={<CompetitionResultsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CompetitionProvider>
    </AuthProvider>
  );
}

export default App;