import { useState } from "react";
import { useBook, useBuilder } from "../../store/BuilderContext";
import { getDesign } from "../../data/designs";
import { money } from "../../lib/pricing";
import Cover from "../shared/Cover";

export default function StepCheckout({
  onPlaceOrder,
}: {
  onPlaceOrder: () => void;
}) {
  const { price, format } = useBook();
  const { designId, title, subtitle } = useBuilder();
  const design = getDesign(designId);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
  });

  const valid =
    form.name && form.email.includes("@") && form.address && form.city && form.zip;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="step-head">
        <h2>Where should we send it?</h2>
        <p>Free shipping, printed and on its way in 3–5 days.</p>
      </div>

      <div className="checkout-grid">
        <div className="checkout-card">
          <h3 style={{ marginTop: 0 }}>Shipping details</h3>
          <div className="field">
            <label>Full name</label>
            <input value={form.name} onChange={set("name")} placeholder="Jamie Rivera" />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              value={form.email}
              onChange={set("email")}
              type="email"
              placeholder="you@email.com"
            />
          </div>
          <div className="field">
            <label>Address</label>
            <input value={form.address} onChange={set("address")} placeholder="123 Maple St" />
          </div>
          <div className="form-row">
            <div className="field">
              <label>City</label>
              <input value={form.city} onChange={set("city")} placeholder="Austin" />
            </div>
            <div className="field">
              <label>ZIP / Postal code</label>
              <input value={form.zip} onChange={set("zip")} placeholder="78701" />
            </div>
          </div>
          <div className="field">
            <label>Country</label>
            <input value={form.country} onChange={set("country")} />
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: 8 }}
            disabled={!valid}
            onClick={onPlaceOrder}
          >
            Place order · {money(price.total)}
          </button>
          <p className="muted" style={{ fontSize: ".8rem", textAlign: "center", marginTop: 10 }}>
            This is a demo checkout — no payment is taken. Connect Shopify or
            Stripe to accept real orders.
          </p>
        </div>

        <aside className="checkout-card">
          <div style={{ width: 130, margin: "0 auto 18px" }}>
            <Cover design={design} title={title} subtitle={subtitle} />
          </div>
          <h3 style={{ textAlign: "center", marginBottom: 18 }}>{title}</h3>
          <div className="summary-row">
            <span className="muted">{format.name}</span>
            <span>{price.pages} pages</span>
          </div>
          <div className="summary-row">
            <span className="muted">Cover</span>
            <span>{design.name}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{money(price.total)}</span>
          </div>
          <div className="summary-row">
            <span className="muted">Shipping</span>
            <span style={{ color: "var(--sage)", fontWeight: 600 }}>FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{money(price.total)}</span>
          </div>
          <p className="muted" style={{ fontSize: ".82rem", marginTop: 12 }}>
            📦 {price.pages} photo pages · lay-flat binding · ships in 3–5 days.
          </p>
        </aside>
      </div>
    </div>
  );
}
