import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { fetchReplay } from './gameReplayService';

const COL_LABELS = 'abcdefghijklmno';

export function useGameReplay() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [moves, setMoves] = useState([]);
  const [meta, setMeta] = useState(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!user?.isPremium) return;
    fetchReplay(id).then(({ data, ok }) => {
      if (ok) {
        setMoves(data.moves ?? []);
        setMeta(data.meta ?? data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [id, user]);

  /* Auto-play */
  useEffect(() => {
    if (!playing) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= moves.length) { setPlaying(false); return s; }
        return s + 1;
      });
    }, 600);
    return () => clearInterval(intervalRef.current);
  }, [playing, moves.length]);

  const currentBoard = (() => {
    const size = meta?.boardSize || 10;
    const board = Array.from({ length: size }, () => Array(size).fill(0));
    moves.slice(0, step).forEach((m, i) => {
      const player = i % 2 === 0 ? 1 : 2;
      if (m.row !== undefined) board[m.row][m.col] = player;
    });
    return board;
  })();

  const toNotation = (m) => {
    if (!m || m.row === undefined) return '—';
    const size = meta?.boardSize || 10;
    return `${COL_LABELS[m.col]}${size - m.row}`;
  };

  const pause = useCallback(() => setPlaying(false), []);
  const resume = useCallback(() => setPlaying(true), []);
  const forward = useCallback(() => setStep((s) => Math.min(s + 1, moves.length)), [moves.length]);
  const backward = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const goToStep = useCallback((n) => setStep(n), []);

  return {
    loading, notFound, user, moves, meta, step, playing,
    currentBoard, toNotation,
    pause, resume, forward, backward, goToStep,
    navigate,
  };
}
