import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage/LoginPage';
import RegisterPage from './pages/auth/RegisterPage/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage/ProfilePage';
import GameSetupPage from './pages/game/GameSetupPage/GameSetupPage';
import GameBoardPage from './pages/game/GameBoardPage/GameBoardPage';
import GameHistoryPage from './pages/game/GameHistoryPage/GameHistoryPage';
import GameReplayPage from './pages/game/GameReplayPage/GameReplayPage';
import OnlineArenaPage from './pages/game/OnlineArenaPage/OnlineArenaPage';
import PlayerManagementPage from './pages/admin/PlayerManagementPage/PlayerManagementPage';
import OnlineGamesPage from './pages/admin/OnlineGamesPage/OnlineGamesPage';

import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Player-protected routes */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/game/setup" replace /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/game/setup" element={<ProtectedRoute><GameSetupPage /></ProtectedRoute>} />
          <Route path="/game/board" element={<ProtectedRoute><GameBoardPage /></ProtectedRoute>} />
          <Route path="/game/history" element={<ProtectedRoute><GameHistoryPage /></ProtectedRoute>} />
          <Route path="/game/replay/:id" element={<ProtectedRoute><GameReplayPage /></ProtectedRoute>} />
          <Route path="/arena" element={<ProtectedRoute><OnlineArenaPage /></ProtectedRoute>} />

          {/* Admin-only routes (A.2.c) */}
          <Route
            path="/admin/players"
            element={<ProtectedRoute requiredRole="ADMIN"><PlayerManagementPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/games"
            element={<ProtectedRoute requiredRole="ADMIN"><OnlineGamesPage /></ProtectedRoute>}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
