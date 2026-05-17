import React from 'react';
import './GameBoard.css';

const COL_LABELS = 'abcdefghijklmno'.split('');

function GameBoard({
  board,
  size,
  winningCells = [],
  lastMove = null,
  onCellClick,
  disabled = false,
  showCoordinates = false,
  boardStyle = 'classic',
}) {
  const isWinning = (r, c) => winningCells.some(([wr, wc]) => wr === r && wc === c);
  const isLastMove = (r, c) => lastMove && lastMove[0] === r && lastMove[1] === c;

  return (
    <div className={`game-board game-board--${boardStyle}`} style={{ '--board-size': size }}>
      {showCoordinates && (
        <div className="game-board__col-labels">
          <span className="game-board__corner" />
          {Array.from({ length: size }, (_, c) => (
            <span key={c} className="game-board__label">{COL_LABELS[c]}</span>
          ))}
        </div>
      )}

      {Array.from({ length: size }, (_, r) => (
        <div key={r} className="game-board__row">
          {showCoordinates && (
            <span className="game-board__label">{size - r}</span>
          )}
          {Array.from({ length: size }, (_, c) => {
            const cell = board[r][c];
            return (
              <button
                key={c}
                className={`game-board__cell
                  ${cell ? `game-board__cell--${cell === 1 ? 'p1' : 'p2'}` : ''}
                  ${isWinning(r, c) ? 'game-board__cell--winning' : ''}
                  ${isLastMove(r, c) ? 'game-board__cell--last' : ''}
                  ${!cell && !disabled ? 'game-board__cell--empty' : ''}
                `}
                onClick={() => !disabled && !cell && onCellClick?.(r, c)}
                disabled={disabled || !!cell}
                aria-label={`Cell ${COL_LABELS[c]}${size - r}`}
              >
                {cell === 1 && <span className="game-board__mark game-board__mark--p1" />}
                {cell === 2 && <span className="game-board__mark game-board__mark--p2" />}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
