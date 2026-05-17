import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import HttpHelper from '../services/httpHelper';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function useWebSocket({ namespace = '/', autoConnect = true, onConnect, onDisconnect } = {}) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!autoConnect) return;

    const token = HttpHelper.getToken();
    socketRef.current = io(`${SOCKET_URL}${namespace}`, {
      auth: { token },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    if (onConnect) socket.on('connect', onConnect);
    if (onDisconnect) socket.on('disconnect', onDisconnect);

    return () => {
      socket.disconnect();
    };
  }, [namespace, autoConnect]);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    socketRef.current?.off(event, handler);
  }, []);

  return { emit, on, off, socket: socketRef };
}
