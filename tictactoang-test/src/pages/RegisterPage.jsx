import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import { useRegisterForm } from "../hooks/useRegisterForm";

const countries = [
  "Australia",
  "Canada",
  "Germany",
  "India",
  "Japan",
  "Singapore",
  "United Kingdom",
  "United States",
  "Vietnam",
];

export default function RegisterPage() {
  const { form, errors, submitted, hasErrors, passwordChecks, updateField, submit } = useRegisterForm();

  function handleSubmit(event) {
    event.preventDefault();
    const valid = submit();
    if (valid) {
      console.log("Ready to send to backend:", form);
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Registration"
        title="Create account"
        description="Required fields: Username, Email, Password, Confirm Password, and Country."
      />

      <SectionCard title="Player registration form" subtitle="Frontend validation should also be repeated on the backend.">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input value={form.username} onChange={(e) => updateField("username", e.target.value)} />
            {(submitted || form.username) && errors.username ? <small className="error-text">{errors.username}</small> : null}
          </label>

          <label>
            <span>Email</span>
            <input value={form.email} onChange={(e) => updateField("email", e.target.value)} />
            {(submitted || form.email) && errors.email ? <small className="error-text">{errors.email}</small> : null}
          </label>

          <label>
            <span>Password</span>
            <input type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
            {(submitted || form.password) && errors.password ? <small className="error-text">{errors.password}</small> : null}
          </label>

          <label>
            <span>Confirm Password</span>
            <input type="password" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} />
            {(submitted || form.confirmPassword) && errors.confirmPassword ? <small className="error-text">{errors.confirmPassword}</small> : null}
          </label>

          <label>
            <span>Country</span>
            <select value={form.country} onChange={(e) => updateField("country", e.target.value)}>
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {submitted && errors.country ? <small className="error-text">{errors.country}</small> : null}
          </label>

          <div className="card muted-card">
            <h4>Password checklist</h4>
            <ul>
              <li>{passwordChecks.length ? "✓" : "•"} At least 8 characters</li>
              <li>{passwordChecks.number ? "✓" : "•"} At least 1 number</li>
              <li>{passwordChecks.special ? "✓" : "•"} At least 1 special character ($#@!)</li>
              <li>{passwordChecks.capital ? "✓" : "•"} At least 1 capital letter</li>
            </ul>
          </div>

          <button className="primary-btn" type="submit">Register</button>
          {submitted && !hasErrors ? <div className="success-box">Frontend validation passed.</div> : null}
        </form>
      </SectionCard>
    </div>
  );
}