import React from 'react';
import { useOnlineArena } from './useOnlineArena';
import GameBoard from '../../../components/GameBoard/GameBoard';
import GameRoom from './components/GameRoom/GameRoom';
import ChatBox from './components/ChatBox/ChatBox';
import Button from '../../../components/Button/Button';
import WinnerOverlay from '../GameBoardPage/components/WinnerOverlay/WinnerOverlay';
import './OnlineArenaPage.css';

function OnlineArenaPage() {
  const {
    user, rooms, roomsLoading, activeRoom, board, currentTurn, winner, winningCells,
    myMark, opponentName, waitingForOpponent,
    creating, createBoardSize, setCreateBoardSize,
    on, off, emit,
    handleCreateRoom, handleJoinRoom, handleCellClick, handleLeaveRoom,
  } = useOnlineArena();

  if (activeRoom) {
    const size = activeRoom.boardSize || 10;
    const p1Name = myMark === 1 ? user?.username : opponentName;
    const p2Name = myMark === 2 ? user?.username : opponentName;

    return (
      <div className="online-arena-page online-arena-page--active">
        <div className="online-arena-page__active-header">
          <span>Room #{activeRoom.roomNumber ?? activeRoom._id?.slice(-4)}</span>
          <Button size="sm" variant="ghost" onClick={handleLeaveRoom}>Leave Room</Button>
        </div>

        {waitingForOpponent ? (
          <div className="online-arena-page__waiting">
            <div className="online-arena-page__waiting-spinner" />
            <p>Waiting for opponent to join…</p>
          </div>
        ) : (
          <div className="online-arena-page__game-layout">
            <GameBoard
              board={board || Array.from({ length: size }, () => Array(size).fill(0))}
              size={size}
              winningCells={winningCells}
              onCellClick={handleCellClick}
              disabled={currentTurn !== myMark || !!winner}
              showCoordinates
            />
            <div className="online-arena-page__side">
              <div className="online-arena-page__turn-info">
                {winner
                  ? `Game Over`
                  : currentTurn === myMark
                    ? 'Your turn'
                    : `${opponentName}'s turn…`
                }
              </div>
              <ChatBox
                roomId={activeRoom._id}
                username={user?.username}
                on={on}
                off={off}
                emit={emit}
              />
            </div>
          </div>
        )}

        {winner && (
          <WinnerOverlay
            winner={winner === 'closed' ? 'aborted' : (winner === myMark ? 1 : 2)}
            p1Name={p1Name}
            p2Name={p2Name}
            onNewGame={handleLeaveRoom}
            onGoSetup={handleLeaveRoom}
          />
        )}
      </div>
    );
  }

  return (
    <div className="online-arena-page">
      <div className="online-arena-page__header">
        <h1 className="online-arena-page__title">Online Arena</h1>
        <div className="online-arena-page__create">
          <select
            className="online-arena-page__size-select"
            value={createBoardSize}
            onChange={(e) => setCreateBoardSize(Number(e.target.value))}
          >
            <option value={10}>10×10</option>
            <option value={15}>15×15</option>
          </select>
          <Button onClick={handleCreateRoom} loading={creating}>
            Create Room
          </Button>
        </div>
      </div>

      <div className="online-arena-page__rooms">
        {roomsLoading ? (
          <p className="online-arena-page__status">Loading rooms…</p>
        ) : rooms.length === 0 ? (
          <p className="online-arena-page__status">No rooms yet. Create one!</p>
        ) : (
          rooms.map((room) => (
            <GameRoom
              key={room._id}
              room={room}
              onJoin={handleJoinRoom}
              isOwn={room.player1Name === user?.username}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default OnlineArenaPage;
