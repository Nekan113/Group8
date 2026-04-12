import { NavLink } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/", label: "Overview", end: true },
  { to: "/register", label: "Register" },
  { to: "/login", label: "Login" },
  { to: "/profile", label: "Profile" },
  { to: "/game", label: "Game" },
  { to: "/premium", label: "Premium" },
];

export default function MainLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, isLoggedIn, user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="eyebrow">TicTacToang</p>
          <h1 className="app-title">Frontend Starter</h1>
          {isLoggedIn ? (
            <p className="login-state">
              Logged in as: {user.username} ({user.role})
            </p>
          ) : null}
        </div>

        <div className="nav-side">
          <div className="top-right-actions">
            <button type="button" className="secondary-btn theme-btn" onClick={toggleTheme}>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            {isLoggedIn ? (
              <button type="button" className="secondary-btn" onClick={logout}>
                Logout
              </button>
            ) : null}
          </div>

          <nav className="nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {item.label}
              </NavLink>
            ))}

            {isAdmin ? (
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Admin
              </NavLink>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="page-container">{children}</main>
    </div>
  );
}