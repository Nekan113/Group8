import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";

const markers = ["X", "O", "△", "◇", "★", "⬢"];

export default function GamePage() {
  const [boardSize, setBoardSize] = useState(10);
  const [playerMark, setPlayerMark] = useState("X");
  const [opponentMark, setOpponentMark] = useState("O");
  const [difficulty, setDifficulty] = useState("Easy");
  const [mode, setMode] = useState("Single Player");

  const board = useMemo(() => {
    return Array.from({ length: boardSize * boardSize }, (_, i) => {
      if ([22, 33, 44, 55, 66].includes(i)) return playerMark;
      if ([45, 46, 47].includes(i)) return opponentMark;
      return "";
    });
  }, [boardSize, playerMark, opponentMark]);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Game"
        title="TicTacToe board"
        description="Supports 10x10 or 15x15 board options, markers, AI difficulty, and winning-line display."
      />

      <div className="game-grid">
        <SectionCard title="Game settings" subtitle="Required customization options.">
          <div className="form-grid">
            <label>
              <span>Mode</span>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Two Player</option>
                <option>Single Player</option>
                <option>Online Match</option>
              </select>
            </label>

            <label>
              <span>AI Difficulty</span>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>

            <label>
              <span>Board Size</span>
              <select value={boardSize} onChange={(e) => setBoardSize(Number(e.target.value))}>
                <option value={10}>10 x 10</option>
                <option value={15}>15 x 15</option>
              </select>
            </label>

            <label>
              <span>Player Mark</span>
              <select value={playerMark} onChange={(e) => setPlayerMark(e.target.value)}>
                {markers.map((marker) => (
                  <option key={marker} value={marker}>{marker}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Opponent Mark</span>
              <select value={opponentMark} onChange={(e) => setOpponentMark(e.target.value)}>
                {markers.map((marker) => (
                  <option key={marker} value={marker}>{marker}</option>
                ))}
              </select>
            </label>
          </div>
        </SectionCard>

        <SectionCard title="Board preview" subtitle="Winning cells are highlighted.">
          <div className="winner-line">Winner: Player A</div>
          <div className="board" style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}>
            {board.map((cell, index) => (
              <button key={index} className={`cell ${[22, 33, 44, 55, 66].includes(index) ? "winning" : ""}`}>
                {cell}
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}