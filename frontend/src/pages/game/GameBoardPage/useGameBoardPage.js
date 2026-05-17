import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSession, abortSession, completeSession } from './gameBoardService';

const DIRS = [[0,1],[1,0],[1,1],[1,-1]];

/* ── Win Detection ── */
function checkWin(board, row, col, player, size) {
  for (const [dr, dc] of DIRS) {
    const line = [[row, col]];
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size || board[r][c] !== player) break;
      line.push([r, c]);
    }
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size || board[r][c] !== player) break;
      line.push([r, c]);
    }
    if (line.length >= 5) return line.slice(0, 5);
  }
  return null;
}

/* ── Count in direction ── */
function countDir(board, r, c, dr, dc, player, size) {
  let count = 0;
  for (let i = 1; i < 5; i++) {
    const nr = r + dr * i, nc = c + dc * i;
    if (nr < 0 || nr >= size || nc < 0 || nc >= size || board[nr][nc] !== player) break;
    count++;
  }
  return count;
}

function isOpen(board, r, c, dr, dc, size) {
  const nr = r + dr, nc = c + dc;
  return nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === 0;
}

/* ── Find blocking/winning move ── */
function findThreatMove(board, player, size) {
  /* Check immediate win / block 5-in-a-row */
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== 0) continue;
      board[r][c] = player;
      const win = checkWin(board, r, c, player, size);
      board[r][c] = 0;
      if (win) return [r, c];
    }
  }
  return null;
}

/* ── Medium AI: block player patterns ── */
function findBlockMove(board, opponent, size) {
  /* 1. Block 5-mark */
  const block5 = findThreatMove(board, opponent, size);
  if (block5) return block5;

  /* 2. Block open 4-mark */
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== 0) continue;
      board[r][c] = opponent;
      for (const [dr, dc] of DIRS) {
        const fwd = countDir(board, r, c, dr, dc, opponent, size);
        const bwd = countDir(board, r, c, -dr, -dc, opponent, size);
        const total = fwd + bwd + 1;
        if (total >= 4) {
          const openFwd = isOpen(board, r + dr * fwd, c + dc * fwd, dr, dc, size);
          const openBwd = isOpen(board, r - dr * bwd, c - dc * bwd, -dr, -dc, size);
          if (openFwd && openBwd) {
            board[r][c] = 0;
            return [r, c];
          }
        }
      }
      board[r][c] = 0;
    }
  }

  /* 3. Block fork (two crossing open-3 lines) */
  const forkCandidates = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== 0) continue;
      board[r][c] = opponent;
      let openThrees = 0;
      for (const [dr, dc] of DIRS) {
        const fwd = countDir(board, r, c, dr, dc, opponent, size);
        const bwd = countDir(board, r, c, -dr, -dc, opponent, size);
        const total = fwd + bwd + 1;
        if (total >= 3) {
          const openFwd = isOpen(board, r + dr * fwd, c + dc * fwd, dr, dc, size);
          const openBwd = isOpen(board, r - dr * bwd, c - dc * bwd, -dr, -dc, size);
          if (openFwd && openBwd) openThrees++;
        }
      }
      board[r][c] = 0;
      if (openThrees >= 2) forkCandidates.push([r, c]);
    }
  }
  if (forkCandidates.length > 0) return forkCandidates[Math.floor(Math.random() * forkCandidates.length)];

  return null;
}

/* ── Easy AI ── */
function easyMove(board, lastMove, size) {
  if (lastMove) {
    const [lr, lc] = lastMove;
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nr = lr + dr, nc = lc + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === 0)
          neighbors.push([nr, nc]);
      }
    if (neighbors.length > 0) return neighbors[Math.floor(Math.random() * neighbors.length)];
  }
  const empty = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] === 0) empty.push([r, c]);
  return empty[Math.floor(Math.random() * empty.length)];
}

/* ── Medium AI ── */
function mediumMove(board, lastMove, size, aiPlayer, humanPlayer) {
  const block = findBlockMove(board, humanPlayer, size);
  if (block) return block;
  return easyMove(board, lastMove, size);
}

/* ── Hard AI ── */
function hardMove(board, lastMove, size, aiPlayer, humanPlayer) {
  /* 1. Win immediately */
  const win = findThreatMove(board, aiPlayer, size);
  if (win) return win;
  /* 2. Block human */
  const block = findBlockMove(board, humanPlayer, size);
  if (block) return block;
  /* 3. Create own 4-mark line */
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== 0) continue;
      board[r][c] = aiPlayer;
      for (const [dr, dc] of DIRS) {
        const total = countDir(board, r, c, dr, dc, aiPlayer, size) +
                      countDir(board, r, c, -dr, -dc, aiPlayer, size) + 1;
        if (total >= 4) { board[r][c] = 0; return [r, c]; }
      }
      board[r][c] = 0;
    }
  }
  return easyMove(board, lastMove, size);
}

const AI_NAMES = { easy: 'Rookie', medium: 'Sparky', hard: 'Nemesis' };

/* ── Main Hook ── */
export function useGameBoardPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const config = state || {};

  const size = config.boardSize || 10;
  const mode = config.mode || 'singleplayer';
  const aiDiff = config.aiDifficulty || 'easy';
  const firstTurn = config.goesFirst === 'player2' ? 2 : 1;

  const makeEmptyBoard = () => Array.from({ length: size }, () => Array(size).fill(0));

  const [board, setBoard] = useState(makeEmptyBoard);
  const [currentTurn, setCurrentTurn] = useState(firstTurn);
  const [winningCells, setWinningCells] = useState([]);
  const [winner, setWinner] = useState(null);
  const [aborted, setAborted] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [startTime] = useState(() => new Date());
  const [sessionId, setSessionId] = useState(null);
  const boardRef = useRef(board);
  boardRef.current = board;

  useEffect(() => {
    createSession({
      mode,
      boardSize: size,
      aiDifficulty: mode === 'singleplayer' ? aiDiff : undefined,
      p2Name: mode === 'twoplayer' ? config.p2Name : (AI_NAMES[aiDiff]),
    }).then(({ data, ok }) => { if (ok) setSessionId(data._id ?? data.id); });
  }, []);

  /* AI plays when it's player 2's turn in singleplayer */
  useEffect(() => {
    if (mode !== 'singleplayer' || currentTurn !== 2 || winner || aborted) return;

    setAiThinking(true);
    const delay = 400 + Math.random() * 300;
    const timer = setTimeout(() => {
      const b = boardRef.current;
      let move;
      const aiPlayer = 2, humanPlayer = 1;
      if (aiDiff === 'easy') move = easyMove(b, lastMove, size);
      else if (aiDiff === 'medium') move = mediumMove(b, lastMove, size, aiPlayer, humanPlayer);
      else move = hardMove(b, lastMove, size, aiPlayer, humanPlayer);

      if (move) placeMarker(move[0], move[1], true);
      setAiThinking(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [currentTurn, winner, aborted, mode]);

  const placeMarker = useCallback((row, col, isAi = false) => {
    if (!isAi && (winner || aborted || aiThinking)) return;
    const newBoard = boardRef.current.map((r) => [...r]);
    if (newBoard[row][col] !== 0) return;

    const player = currentTurn;
    newBoard[row][col] = player;
    boardRef.current = newBoard;
    setBoard(newBoard);
    setLastMove([row, col]);
    setMoveCount((n) => n + 1);

    const winLine = checkWin(newBoard, row, col, player, size);
    if (winLine) {
      setWinningCells(winLine);
      setWinner(player);
      const endTime = new Date();
      if (sessionId) {
        completeSession(sessionId, {
          winner: player,
          endTime,
          result: player === 1 ? 'player1wins' : 'player2wins',
        });
      }
      return;
    }

    const allFilled = newBoard.every((r) => r.every((c) => c !== 0));
    if (allFilled) { setWinner('draw'); return; }

    setCurrentTurn(player === 1 ? 2 : 1);
  }, [currentTurn, winner, aborted, aiThinking, size, sessionId]);

  const handleCellClick = useCallback((row, col) => {
    if (mode === 'singleplayer' && currentTurn === 2) return;
    placeMarker(row, col);
  }, [mode, currentTurn, placeMarker]);

  const handleAbort = useCallback(async () => {
    setAborted(true);
    if (sessionId) await abortSession(sessionId);
  }, [sessionId]);

  const handleNewGame = useCallback(() => navigate('/game/setup'), [navigate]);

  const p1Name = config.p1Name || 'Player 1';
  const p2Name = mode === 'singleplayer' ? AI_NAMES[aiDiff] : (config.p2Name || 'Player 2');

  return {
    board, size, currentTurn, winningCells, winner, aborted, aiThinking,
    lastMove, moveCount, mode,
    p1Name, p2Name, p1Marker: config.p1Marker || 'X', p2Marker: config.p2Marker || 'O',
    p1Avatar: config.p1Avatar, boardStyle: config.boardStyle || 'classic',
    handleCellClick, handleAbort, handleNewGame,
  };
}
