import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useAuth } from '../../../hooks/useAuth';
import { fetchRooms, createRoom, joinRoom } from './onlineArenaService';

export function useOnlineArena() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState(null);
  const [board, setBoard] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [myMark, setMyMark] = useState(null);
  const [opponentName, setOpponentName] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createBoardSize, setCreateBoardSize] = useState(10);

  const { emit, on, off } = useWebSocket({ namespace: '/arena', autoConnect: true });

  /* Load rooms via REST + socket events */
  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    const unsubNew = on('room:created', (room) => setRooms((r) => [room, ...r]));
    const unsubJoin = on('room:joined', ({ roomId, player2Name }) => {
      setRooms((rs) => rs.map((r) => r._id === roomId ? { ...r, player2: player2Name } : r));
      if (activeRoom?._id === roomId) {
        setOpponentName(player2Name);
        setWaitingForOpponent(false);
      }
    });
    const unsubMove = on('game:move', ({ row, col, player, nextTurn }) => {
      setBoard((b) => {
        if (!b) return b;
        const nb = b.map((r) => [...r]);
        nb[row][col] = player;
        return nb;
      });
      setCurrentTurn(nextTurn);
    });
    const unsubWin = on('game:win', ({ player, cells }) => {
      setWinner(player);
      setWinningCells(cells ?? []);
    });
    const unsubClose = on('room:closed', ({ roomId }) => {
      setRooms((rs) => rs.filter((r) => r._id !== roomId));
      if (activeRoom?._id === roomId) setWinner('closed');
    });

    return () => { unsubNew?.(); unsubJoin?.(); unsubMove?.(); unsubWin?.(); unsubClose?.(); };
  }, [on, activeRoom]);

  const loadRooms = useCallback(async () => {
    setRoomsLoading(true);
    const { data, ok } = await fetchRooms();
    if (ok) setRooms(Array.isArray(data) ? data : data.rooms ?? []);
    setRoomsLoading(false);
  }, []);

  const handleCreateRoom = useCallback(async () => {
    setCreating(true);
    const { data, ok } = await createRoom({ boardSize: createBoardSize });
    if (ok) {
      const size = createBoardSize;
      setActiveRoom(data);
      setBoard(Array.from({ length: size }, () => Array(size).fill(0)));
      setMyMark(1);
      setWaitingForOpponent(true);
      emit('room:join', { roomId: data._id });
    }
    setCreating(false);
  }, [createBoardSize, emit]);

  const handleJoinRoom = useCallback(async (room) => {
    const { data, ok } = await joinRoom(room._id);
    if (ok) {
      const size = room.boardSize || 10;
      setActiveRoom(room);
      setBoard(Array.from({ length: size }, () => Array(size).fill(0)));
      setMyMark(2);
      setOpponentName(room.player1Name);
      setWaitingForOpponent(false);
      emit('room:join', { roomId: room._id });
    }
  }, [emit]);

  const handleCellClick = useCallback((row, col) => {
    if (!activeRoom || winner || !board) return;
    if (board[row][col] !== 0) return;
    if (currentTurn !== myMark) return;
    emit('game:move', { roomId: activeRoom._id, row, col });
  }, [activeRoom, winner, board, currentTurn, myMark, emit]);

  const handleLeaveRoom = useCallback(() => {
    if (activeRoom) emit('room:leave', { roomId: activeRoom._id });
    setActiveRoom(null);
    setBoard(null);
    setWinner(null);
    setWaitingForOpponent(false);
    setMyMark(null);
    setChatMessages([]);
    loadRooms();
  }, [activeRoom, emit, loadRooms]);

  return {
    user, rooms, roomsLoading, activeRoom, board, currentTurn, winner, winningCells,
    myMark, opponentName, chatMessages, setChatMessages, waitingForOpponent,
    creating, createBoardSize, setCreateBoardSize,
    on, off, emit,
    handleCreateRoom, handleJoinRoom, handleCellClick, handleLeaveRoom,
  };
}
