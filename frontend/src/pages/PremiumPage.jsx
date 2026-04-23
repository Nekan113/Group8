import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";

export default function PremiumPage() {
  const [wallet, setWallet] = useState(20);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Wallet");

  function handleDeposit() {
    const numeric = Number(amount);
    if (numeric > 0) {
      setWallet((prev) => prev + numeric);
      setAmount("");
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Premium"
        title="Premium subscription"
        description="Simple monthly $10 premium flow with wallet deposit and third-party payment option."
      />

      <div className="two-col">
        <SectionCard title="Plan" subtitle="Premium status should later appear on the profile page.">
          <h3>$10 / month</h3>
          <ul>
            <li>Wallet-based payment</li>
            <li>Third-party payment support</li>
            <li>Email notification after successful payment</li>
          </ul>
        </SectionCard>

        <SectionCard title="Payment" subtitle="Frontend flow only.">
          <div className="form-grid">
            <p>Wallet Balance: ${wallet.toFixed(2)}</p>

            <label>
              <span>Payment Method</span>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option>Wallet</option>
                <option>Stripe</option>
                <option>PayPal</option>
              </select>
            </label>

            <label>
              <span>Deposit Amount</span>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>

            <button className="secondary-btn" type="button" onClick={handleDeposit}>Deposit</button>
            <button className="primary-btn" type="button">Subscribe</button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}