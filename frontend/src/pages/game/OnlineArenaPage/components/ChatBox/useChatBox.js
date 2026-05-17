import { useState, useCallback, useEffect, useRef } from 'react';

export function useChatBox({ roomId, username, on, off, emit }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const unsub = on('chat:message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => unsub?.();
  }, [on]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(() => {
    const text = message.trim();
    if (!text || !roomId) return;
    emit('chat:send', { roomId, text, username });
    setMessages((prev) => [...prev, { username, text, self: true, ts: Date.now() }]);
    setMessage('');
  }, [message, roomId, username, emit]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  return { message, setMessage, messages, bottomRef, handleSend, handleKeyDown };
}
