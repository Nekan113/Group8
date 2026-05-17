import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNavbar } from './useNavbar';
import './Navbar.css';

function Navbar() {
  const { user, menuOpen, handleLogout, toggleMenu, closeMenu } = useNavbar();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand" onClick={closeMenu}>
        TicTacToang
      </Link>

      <button className="navbar__hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {user ? (
          <>
            <NavLink to="/game/setup" className="navbar__link" onClick={closeMenu}>Play</NavLink>
            <NavLink to="/arena" className="navbar__link" onClick={closeMenu}>Arena</NavLink>
            <NavLink to="/profile" className="navbar__link" onClick={closeMenu}>Profile</NavLink>
            {user.role === 'ADMIN' && (
              <NavLink to="/admin/players" className="navbar__link navbar__link--admin" onClick={closeMenu}>
                Admin
              </NavLink>
            )}
            <div className="navbar__user">
              <img
                src={user.avatarUrl || '/default-avatar.png'}
                alt={user.username}
                className="navbar__avatar"
              />
              <span className="navbar__username">{user.username}</span>
              {user.isPremium && <span className="navbar__badge">PRO</span>}
            </div>
            <button className="navbar__logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navbar__link" onClick={closeMenu}>Login</NavLink>
            <NavLink to="/register" className="navbar__link navbar__link--cta" onClick={closeMenu}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
