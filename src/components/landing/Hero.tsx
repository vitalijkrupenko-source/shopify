import { Link } from "react-router-dom";
import Cover from "../shared/Cover";
import { DESIGNS } from "../../data/designs";

export default function Hero() {
  return (
    <header className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">📦 Printed & shipped to your door</span>
          <h1>
            Your camera roll, <em>finally</em> a real photo book.
          </h1>
          <p className="hero-sub">
            You have thousands of beautiful photos of your kids on your phone —
            and almost none of them printed. Upload your favorites, pick a
            design, and we’ll turn them into a keepsake memory book your family
            will actually hold.
          </p>
          <div className="hero-cta">
            <Link to="/create" className="btn btn-primary btn-lg">
              Start your book — it’s free to design
            </Link>
            <a href="#how" className="btn btn-ghost btn-lg">
              See how it works
            </a>
          </div>
          <div className="hero-trust">
            <div className="avatars">
              <span style={{ background: "#FF7A5C" }}>A</span>
              <span style={{ background: "#7FB29A" }}>M</span>
              <span style={{ background: "#FFC857", color: "#3a2a14" }}>J</span>
              <span style={{ background: "#3a3f6b" }}>+</span>
            </div>
            <div>
              <div className="stars">★★★★★</div>
              <span>Loved by 12,000+ families</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-book-2">
            <Cover design={DESIGNS[2]} title="Summer" subtitle="By the sea" />
          </div>
          <div className="hero-book">
            <Cover design={DESIGNS[0]} title="Our Year Together" subtitle="2026" />
          </div>
          <div className="hero-float hero-float-1">
            <span className="float-emoji">📲</span>
            <div>
              Uploaded 38 photos
              <small>about 90 seconds</small>
            </div>
          </div>
          <div className="hero-float hero-float-2">
            <span className="float-emoji">🚚</span>
            <div>
              On its way!
              <small>Printed in 3–5 days</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
