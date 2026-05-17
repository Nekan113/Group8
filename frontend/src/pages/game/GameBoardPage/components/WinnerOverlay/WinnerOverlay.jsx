import React from 'react';
import Button from '../../../../../components/Button/Button';
import './WinnerOverlay.css';

function WinnerOverlay({ winner, p1Name, p2Name, onNewGame, onGoSetup }) {
  const isDraw = winner === 'draw';
  const isAborted = winner === 'aborted';
  const winnerName = winner === 1 ? p1Name : winner === 2 ? p2Name : null;

  return (
    <div className="winner-overlay">
      <div className="winner-overlay__card">
        {isAborted ? (
          <>
            <div className="winner-overlay__icon winner-overlay__icon--aborted">✕</div>
            <h2 className="winner-overlay__title">Game Aborted</h2>
            <p className="winner-overlay__subtitle">No result recorded.</p>
          </>
        ) : isDraw ? (
          <>
            <div className="winner-overlay__icon winner-overlay__icon--draw">═</div>
            <h2 className="winner-overlay__title">It's a Draw!</h2>
            <p className="winner-overlay__subtitle">Well played by both sides.</p>
          </>
        ) : (
          <>
            <div className="winner-overlay__confetti" aria-hidden="true">
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className="winner-overlay__confetti-piece" style={{ '--i': i }} />
              ))}
            </div>
            <div className="winner-overlay__icon winner-overlay__icon--win">🏆</div>
            <h2 className="winner-overlay__title">{winnerName} Wins!</h2>
            <p className="winner-overlay__subtitle">5 in a row — congratulations!</p>
          </>
        )}
        <div className="winner-overlay__actions">
          <Button onClick={onNewGame} variant="primary">Play Again</Button>
          <Button onClick={onGoSetup} variant="ghost">Change Setup</Button>
        </div>
      </div>
    </div>
  );
}

export default WinnerOverlay;
