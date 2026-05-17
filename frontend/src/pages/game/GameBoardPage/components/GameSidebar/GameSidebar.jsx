import React from 'react';
import './GameSidebar.css';

function GameSidebar({
  currentTurn, winner, aborted, aiThinking,
  p1Name, p2Name, p1Marker, p2Marker,
  p1Avatar, moveCount, onAbort,
}) {
  return (
    <aside className="game-sidebar">
      <div className={`game-sidebar__player ${currentTurn === 1 && !winner && !aborted ? 'game-sidebar__player--active' : ''}`}>
        <img src={p1Avatar || '/default-avatar.png'} alt={p1Name} className="game-sidebar__avatar" />
        <div className="game-sidebar__player-info">
          <span className="game-sidebar__player-name">{p1Name}</span>
          <span className="game-sidebar__marker">{p1Marker}</span>
        </div>
        {currentTurn === 1 && !winner && !aborted && (
          <span className="game-sidebar__turn-indicator">Your turn</span>
        )}
      </div>

      <div className="game-sidebar__vs">vs</div>

      <div className={`game-sidebar__player ${currentTurn === 2 && !winner && !aborted ? 'game-sidebar__player--active' : ''}`}>
        <div className="game-sidebar__player-info">
          <span className="game-sidebar__player-name">{p2Name}</span>
          <span className="game-sidebar__marker">{p2Marker}</span>
        </div>
        {currentTurn === 2 && !winner && !aborted && (
          <span className="game-sidebar__turn-indicator">
            {aiThinking ? 'Thinking…' : 'Turn'}
          </span>
        )}
      </div>

      <div className="game-sidebar__stats">
        <div className="game-sidebar__stat">
          <span className="game-sidebar__stat-label">Moves</span>
          <span className="game-sidebar__stat-value">{moveCount}</span>
        </div>
      </div>

      {!winner && !aborted && (
        <button className="game-sidebar__abort" onClick={onAbort}>Abort Game</button>
      )}
    </aside>
  );
}

export default GameSidebar;
