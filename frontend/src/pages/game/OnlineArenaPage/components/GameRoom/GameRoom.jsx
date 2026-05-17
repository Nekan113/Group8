import React from 'react';
import Button from '../../../../../components/Button/Button';
import './GameRoom.css';

function GameRoom({ room, onJoin, isOwn }) {
  const isFull = !!room.player2Name;

  return (
    <div className={`game-room ${isFull ? 'game-room--full' : ''}`}>
      <div className="game-room__info">
        <span className="game-room__number">Room #{room.roomNumber ?? room._id?.slice(-4)}</span>
        <span className="game-room__size">{room.boardSize ?? 10}×{room.boardSize ?? 10}</span>
      </div>
      <div className="game-room__players">
        <span className="game-room__player game-room__player--p1">{room.player1Name}</span>
        <span className="game-room__vs">vs</span>
        <span className={`game-room__player ${isFull ? '' : 'game-room__player--waiting'}`}>
          {room.player2Name || 'Waiting…'}
        </span>
      </div>
      {!isFull && !isOwn && (
        <Button size="sm" onClick={() => onJoin(room)}>Join</Button>
      )}
      {isOwn && <span className="game-room__own-badge">Your Room</span>}
      {isFull && !isOwn && <span className="game-room__full-badge">Full</span>}
    </div>
  );
}

export default GameRoom;
