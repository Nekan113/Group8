import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const result = await login(identity, password);

    if (result.success) {
      if (result.user.role === "admin") {
        setMessage("Logged in as admin.");
        navigate("/admin");
      } else {
        setMessage("Logged in as player.");
        navigate("/");
      }
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Login"
        title="Sign in"
        description="Use admin@gmail.com / 1234abcd! for the demo admin account."
      />

      <SectionCard title="Login" subtitle="Use username or email">
        <form className="form-grid" onSubmit={handleLogin}>
          <label>
            <span>Username or Email</span>
            <input value={identity} onChange={(e) => setIdentity(e.target.value)} />
          </label>

          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <button className="primary-btn" type="submit">Login</button>

          {message ? <p>{message}</p> : null}
        </form>
      </SectionCard>
    </div>
  );
}