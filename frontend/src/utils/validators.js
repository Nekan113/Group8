export function validateUsername(username) {
  if (!username) return "Username is required.";
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return "Username can only contain English letters, numbers, underscore (_) and hyphen (-).";
  }
  return "";
}

export function validateEmail(email) {
  const atCount = (email.match(/@/g) || []).length;
  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  if (!email) return "Email is required.";
  if (atCount !== 1) return "Email must contain exactly one @ symbol, for example user@example.com.";
  if (atIndex <= 0 || dotIndex <= atIndex + 1 || dotIndex === email.length - 1) {
    return "Email must contain a valid domain after @, for example user@example.com.";
  }
  if (email.length >= 255) return "Email must be less than 255 characters.";
  if (/[\s();:]/.test(email)) {
    return "Email cannot contain spaces or prohibited characters like ( ) ; :.";
  }
  return "";
}

export function getPasswordChecks(password) {
  return {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[$#@!]/.test(password),
    capital: /[A-Z]/.test(password),
  };
}

export function validatePassword(password) {
  const checks = getPasswordChecks(password);
  const valid = Object.values(checks).every(Boolean);

  return {
    valid,
    checks,
    message: valid
      ? ""
      : "Password must have at least 8 characters, 1 number, 1 special character, and 1 capital letter.",
  };
}