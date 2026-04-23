import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import DataTable from "../components/common/DataTable";

const columns = [
  { key: "id", label: "Session" },
  { key: "opponent", label: "Opponent" },
  { key: "type", label: "Type" },
  { key: "result", label: "Result" },
  { key: "start", label: "Start" },
  { key: "end", label: "End" },
];

const rows = [
  { id: "GS-2101", opponent: "Jeremy (Easy)", type: "Single Player", result: "Win", start: "2026-04-03 09:10", end: "2026-04-03 09:18" },
  { id: "GS-2102", opponent: "Player B", type: "Two Player", result: "Lose", start: "2026-04-03 19:10", end: "2026-04-03 19:26" },
  { id: "GS-2103", opponent: "Anna", type: "Online Match", result: "Aborted", start: "2026-04-04 20:05", end: "2026-04-04 20:07" },
];

export default function ProfilePage() {
  const [keyword, setKeyword] = useState("");

  const filteredRows = useMemo(() => {
    const query = keyword.toLowerCase();
    return rows.filter((row) => row.id.toLowerCase().includes(query) || row.opponent.toLowerCase().includes(query));
  }, [keyword]);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Profile"
        title="Profile management"
        description="Players can edit account details, upload avatar/logo, and review searchable game history."
      />

      <div className="profile-grid">
        <SectionCard title="Player details" subtitle="Responsive profile UI.">
          <div className="avatar-box">A</div>
          <button className="secondary-btn" type="button">Upload logo picture</button>

          <div className="form-grid">
            <label><span>Email</span><input defaultValue="playerA@example.com" /></label>
            <label><span>Username</span><input defaultValue="playerA" /></label>
            <label><span>Password</span><input type="password" defaultValue="Password123!" /></label>
            <label><span>Country</span><input defaultValue="Vietnam" /></label>
          </div>
        </SectionCard>

        <SectionCard title="Game history" subtitle="Search by session number or player name.">
          <input
            placeholder="Search by session number or player name"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <DataTable columns={columns} rows={filteredRows} />
        </SectionCard>
      </div>
    </div>
  );
}