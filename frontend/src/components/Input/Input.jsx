import React from 'react';
import './Input.css';

function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  hint = '',
  disabled = false,
  required = false,
  autoComplete,
  className = '',
}) {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label className="input-group__label" htmlFor={id}>
          {label} {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className="input-group__field"
      />
      {error && <span className="input-group__error">{error}</span>}
      {!error && hint && <span className="input-group__hint">{hint}</span>}
    </div>
  );
}

export default Input;
