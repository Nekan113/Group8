import React from 'react';
import './Button.css';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <span className="btn__spinner" /> : children}
    </button>
  );
}

export default Button;
