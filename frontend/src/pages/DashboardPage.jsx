import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Overview"
        title="TicTacToang frontend"
        description="A simple React frontend starter covering registration, login, profile, game, premium subscription, and admin pages."
      />

      <section className="stats-grid">
        <StatCard label="Registration" value="Ready" hint="Required form fields and validation" />
        <StatCard label="Profile" value="Ready" hint="History table and edit form" />
        <StatCard label="Game" value="Ready" hint="Board setup and board preview" />
        <StatCard label="Admin" value="Ready" hint="Responsive tables for players and rooms" />
      </section>
    </div>
  );
}