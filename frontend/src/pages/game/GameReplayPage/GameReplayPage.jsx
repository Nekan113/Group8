import React from 'react';
import { Link } from 'react-router-dom';
import { useGameReplay } from './useGameReplay';
import GameBoard from '../../../components/GameBoard/GameBoard';
import Button from '../../../components/Button/Button';
import './GameReplayPage.css';

function GameReplayPage() {
  const {
    loading, notFound, user, moves, meta, step, playing,
    currentBoard, toNotation,
    pause, resume, forward, backward, goToStep,
  } = useGameReplay();

  if (!user?.isPremium) {
    return (
      <div className="game-replay-page game-replay-page--gate">
        <div className="game-replay-page__gate-card">
          <h2>Premium Feature</h2>
          <p>Match replays are available for Premium members only.</p>
          <Link to="/profile">
            <Button>Upgrade to Premium</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="game-replay-page__status">Loading replay…</div>;
  if (notFound) return <div className="game-replay-page__status">Replay not found.</div>;

  const size = meta?.boardSize || 10;
  const currentMove = moves[step - 1];
  const currentMoveNotation = currentMove ? toNotation(currentMove) : null;

  return (
    <div className="game-replay-page">
      <div className="game-replay-page__header">
        <h1 className="game-replay-page__title">Match Replay</h1>
        {meta && (
          <p className="game-replay-page__meta">
            {meta.p1Name} vs {meta.p2Name} · {meta.boardSize}×{meta.boardSize}
          </p>
        )}
      </div>

      <div className="game-replay-page__layout">
        <GameBoard
          board={currentBoard}
          size={size}
          winningCells={[]}
          lastMove={currentMove ? [currentMove.row, currentMove.col] : null}
          disabled
          showCoordinates
        />

        <div className="game-replay-page__panel">
          <div className="game-replay-page__controls">
            <Button onClick={backward} disabled={step === 0} variant="ghost" size="sm">◀◀</Button>
            {playing
              ? <Button onClick={pause} size="sm">⏸ Pause</Button>
              : <Button onClick={resume} disabled={step >= moves.length} size="sm">▶ Play</Button>
            }
            <Button onClick={forward} disabled={step >= moves.length} variant="ghost" size="sm">▶▶</Button>
          </div>

          <div className="game-replay-page__step-info">
            Move {step} / {moves.length}
            {currentMoveNotation && (
              <span className="game-replay-page__notation"> — {currentMoveNotation}</span>
            )}
          </div>

          <input
            type="range"
            min={0}
            max={moves.length}
            value={step}
            onChange={(e) => goToStep(Number(e.target.value))}
            className="game-replay-page__scrubber"
          />

          <div className="game-replay-page__move-list">
            {moves.map((m, i) => (
              <button
                key={i}
                className={`game-replay-page__move ${i + 1 === step ? 'game-replay-page__move--current' : ''}`}
                onClick={() => goToStep(i + 1)}
              >
                <span className={`game-replay-page__move-player game-replay-page__move-player--${i % 2 === 0 ? 'p1' : 'p2'}`}>
                  {i % 2 === 0 ? meta?.p1Name : meta?.p2Name}
                </span>
                <span className="game-replay-page__move-coord">{toNotation(m)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameReplayPage;
