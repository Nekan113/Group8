import React from 'react';
import { useChatBox } from './useChatBox';
import './ChatBox.css';

function ChatBox({ roomId, username, on, off, emit }) {
  const { message, setMessage, messages, bottomRef, handleSend, handleKeyDown } = useChatBox({
    roomId, username, on, off, emit,
  });

  return (
    <div className="chat-box">
      <div className="chat-box__header">Chat</div>
      <div className="chat-box__messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-box__message ${m.self ? 'chat-box__message--self' : ''}`}>
            {!m.self && <span className="chat-box__sender">{m.username}</span>}
            <span className="chat-box__text">{m.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-box__input-area">
        <input
          className="chat-box__input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          maxLength={200}
        />
        <button className="chat-box__send" onClick={handleSend} disabled={!message.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
