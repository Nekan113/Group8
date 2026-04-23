import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import DataTable from "../components/common/DataTable";

const playerColumns = [
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "premium", label: "Premium Status" },
  { key: "status", label: "Account Status" },
];

const roomColumns = [
  { key: "room", label: "Room Number" },
  { key: "player1", label: "Player 1" },
  { key: "player2", label: "Player 2" },
  { key: "start", label: "Start Time" },
  { key: "end", label: "End Time" },
];

const players = [
  { username: "playerA", email: "playerA@example.com", premium: "Yes", status: "Active" },
  { username: "playerB", email: "playerB@example.com", premium: "No", status: "Active" },
  { username: "retrocat", email: "retrocat@example.com", premium: "No", status: "Inactive" },
];

const rooms = [
  { room: "RM-1001", player1: "Player A", player2: "Waiting...", start: "-", end: "-" },
  { room: "RM-1002", player1: "Alice", player2: "Bob", start: "12:10", end: "-" },
  { room: "RM-1003", player1: "Nana", player2: "Nam", start: "11:30", end: "11:55" },
];

export default function AdminPage() {
  const [keyword, setKeyword] = useState("");

  const filteredRooms = useMemo(() => {
    const query = keyword.toLowerCase();
    return rooms.filter(
      (room) =>
        room.room.toLowerCase().includes(query) ||
        room.player1.toLowerCase().includes(query) ||
        room.player2.toLowerCase().includes(query)
    );
  }, [keyword]);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Admin"
        title="Admin functionality"
        description="Responsive admin pages for player management and online room monitoring."
      />

      <SectionCard title="Players" subtitle="Shows username, email, premium status, and account status.">
        <DataTable columns={playerColumns} rows={players} />
      </SectionCard>

      <SectionCard title="Online game rooms" subtitle="Search by room number or player name.">
        <input
          placeholder="Search room number or player name"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <DataTable columns={roomColumns} rows={filteredRooms} />
      </SectionCard>
    </div>
  );
}