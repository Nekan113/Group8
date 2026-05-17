import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const MARKERS = ['★', '♦', '▲', '●', '■', '♠'];
const BOARD_STYLES = ['classic', 'neon', 'wood'];

export function useGameSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('singleplayer');
  const [boardSize, setBoardSize] = useState(10);
  const [boardStyle, setBoardStyle] = useState('classic');
  const [p1Marker, setP1Marker] = useState(0);
  const [p2Marker, setP2Marker] = useState(1);
  const [aiDifficulty, setAiDifficulty] = useState('easy');
  const [goesFirst, setGoesFirst] = useState('player1');
  const [p2Name, setP2Name] = useState('');
  const [p2NameError, setP2NameError] = useState('');

  const handleStart = useCallback(() => {
    if (mode === 'twoplayer' && !p2Name.trim()) {
      setP2NameError('Please enter Player 2 name.');
      return;
    }
    navigate('/game/board', {
      state: {
        mode,
        boardSize,
        boardStyle,
        p1Marker: MARKERS[p1Marker],
        p2Marker: MARKERS[p2Marker],
        aiDifficulty,
        goesFirst,
        p2Name: mode === 'twoplayer' ? p2Name.trim() : null,
        p1Name: user?.username,
        p1Avatar: user?.avatarUrl,
      },
    });
  }, [mode, boardSize, boardStyle, p1Marker, p2Marker, aiDifficulty, goesFirst, p2Name, user, navigate]);

  return {
    mode, setMode,
    boardSize, setBoardSize,
    boardStyle, setBoardStyle,
    p1Marker, setP1Marker,
    p2Marker, setP2Marker,
    aiDifficulty, setAiDifficulty,
    goesFirst, setGoesFirst,
    p2Name, setP2Name, p2NameError,
    MARKERS, BOARD_STYLES,
    handleStart,
  };
}
