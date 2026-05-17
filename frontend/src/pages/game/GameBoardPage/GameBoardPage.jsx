import React from 'react';
import { useGameBoardPage } from './useGameBoardPage';
import GameBoard from '../../../components/GameBoard/GameBoard';
import GameSidebar from './components/GameSidebar/GameSidebar';
import WinnerOverlay from './components/WinnerOverlay/WinnerOverlay';
import './GameBoardPage.css';

function GameBoardPage() {
  const {
    board, size, currentTurn, winningCells, winner, aborted, aiThinking,
    lastMove, moveCount, mode,
    p1Name, p2Name, p1Marker, p2Marker, p1Avatar, boardStyle,
    handleCellClick, handleAbort, handleNewGame,
  } = useGameBoardPage();

  return (
    <div className="game-board-page">
      <div className="game-board-page__layout">
        <GameSidebar
          currentTurn={currentTurn}
          winner={winner}
          aborted={aborted}
          aiThinking={aiThinking}
          p1Name={p1Name}
          p2Name={p2Name}
          p1Marker={p1Marker}
          p2Marker={p2Marker}
          p1Avatar={p1Avatar}
          moveCount={moveCount}
          onAbort={handleAbort}
        />

        <div className="game-board-page__board-area">
          {aiThinking && (
            <div className="game-board-page__thinking-banner">AI is thinking…</div>
          )}
          <GameBoard
            board={board}
            size={size}
            winningCells={winningCells}
            lastMove={lastMove}
            onCellClick={handleCellClick}
            disabled={!!winner || aborted || (mode === 'singleplayer' && currentTurn === 2)}
            showCoordinates
            boardStyle={boardStyle}
          />
        </div>
      </div>

      {(winner || aborted) && (
        <WinnerOverlay
          winner={aborted ? 'aborted' : winner}
          p1Name={p1Name}
          p2Name={p2Name}
          onNewGame={handleNewGame}
          onGoSetup={handleNewGame}
        />
      )}
    </div>
  );
}

export default GameBoardPage;
