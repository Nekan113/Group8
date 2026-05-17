import React from 'react';
import { useGameSetup } from './useGameSetup';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import './GameSetupPage.css';

function GameSetupPage() {
  const {
    mode, setMode,
    boardSize, setBoardSize,
    boardStyle, setBoardStyle,
    p1Marker, setP1Marker,
    p2Marker, setP2Marker,
    aiDifficulty, setAiDifficulty,
    goesFirst, setGoesFirst,
    p2Name, setP2Name, p2NameError,
    MARKERS, BOARD_STYLES,
    handleStart,
  } = useGameSetup();

  return (
    <div className="game-setup-page">
      <div className="game-setup-page__card">
        <h1 className="game-setup-page__title">Game Setup</h1>

        <section className="game-setup-page__section">
          <h2 className="game-setup-page__section-title">Game Mode</h2>
          <div className="game-setup-page__options">
            {[
              { value: 'singleplayer', label: 'vs AI' },
              { value: 'twoplayer', label: 'Two Players (Local)' },
            ].map((m) => (
              <button
                key={m.value}
                className={`game-setup-page__option ${mode === m.value ? 'game-setup-page__option--active' : ''}`}
                onClick={() => setMode(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </section>

        {mode === 'twoplayer' && (
          <section className="game-setup-page__section">
            <h2 className="game-setup-page__section-title">Player 2 Name</h2>
            <Input
              id="p2-name"
              value={p2Name}
              onChange={(e) => setP2Name(e.target.value)}
              placeholder="Enter Player 2 username"
              error={p2NameError}
            />
          </section>
        )}

        {mode === 'singleplayer' && (
          <section className="game-setup-page__section">
            <h2 className="game-setup-page__section-title">AI Difficulty</h2>
            <div className="game-setup-page__options">
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  className={`game-setup-page__option game-setup-page__option--${d} ${aiDifficulty === d ? 'game-setup-page__option--active' : ''}`}
                  onClick={() => setAiDifficulty(d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="game-setup-page__section">
          <h2 className="game-setup-page__section-title">Board Size</h2>
          <div className="game-setup-page__options">
            {[10, 15].map((s) => (
              <button
                key={s}
                className={`game-setup-page__option ${boardSize === s ? 'game-setup-page__option--active' : ''}`}
                onClick={() => setBoardSize(s)}
              >
                {s}×{s}
              </button>
            ))}
          </div>
        </section>

        <section className="game-setup-page__section">
          <h2 className="game-setup-page__section-title">Board Style</h2>
          <div className="game-setup-page__options">
            {BOARD_STYLES.map((s) => (
              <button
                key={s}
                className={`game-setup-page__option ${boardStyle === s ? 'game-setup-page__option--active' : ''}`}
                onClick={() => setBoardStyle(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section className="game-setup-page__section">
          <h2 className="game-setup-page__section-title">Choose Markers</h2>
          <div className="game-setup-page__markers">
            <div>
              <p className="game-setup-page__marker-label">Player 1 (You)</p>
              <div className="game-setup-page__marker-row">
                {MARKERS.map((m, i) => (
                  <button
                    key={i}
                    className={`game-setup-page__marker ${p1Marker === i ? 'game-setup-page__marker--active' : ''}`}
                    onClick={() => setP1Marker(i)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="game-setup-page__marker-label">
                {mode === 'singleplayer' ? 'AI' : 'Player 2'}
              </p>
              <div className="game-setup-page__marker-row">
                {MARKERS.map((m, i) => (
                  <button
                    key={i}
                    className={`game-setup-page__marker ${p2Marker === i ? 'game-setup-page__marker--active' : ''}`}
                    onClick={() => setP2Marker(i)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="game-setup-page__section">
          <h2 className="game-setup-page__section-title">Who Goes First?</h2>
          <div className="game-setup-page__options">
            {[
              { value: 'player1', label: 'Player 1' },
              { value: 'player2', label: mode === 'singleplayer' ? 'AI' : 'Player 2' },
            ].map((o) => (
              <button
                key={o.value}
                className={`game-setup-page__option ${goesFirst === o.value ? 'game-setup-page__option--active' : ''}`}
                onClick={() => setGoesFirst(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>

        <Button fullWidth size="lg" onClick={handleStart}>
          Start Game
        </Button>
      </div>
    </div>
  );
}

export default GameSetupPage;
