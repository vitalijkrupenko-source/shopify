import { useBuilder } from "../../store/BuilderContext";
import { DESIGNS } from "../../data/designs";
import Cover from "../shared/Cover";

export default function StepCover() {
  const { designId, setDesignId, title, subtitle, setTitle, setSubtitle } =
    useBuilder();
  return (
    <div>
      <div className="step-head">
        <h2>Pick a cover design</h2>
        <p>Then make it yours with a title and a date.</p>
      </div>

      <div className="cover-select">
        {DESIGNS.map((d) => (
          <button
            key={d.id}
            className={`cover-opt ${designId === d.id ? "selected" : ""}`}
            onClick={() => setDesignId(d.id)}
          >
            <Cover design={d} title={title || "Our Story"} subtitle={subtitle} />
            <div className="name">{d.name}</div>
          </button>
        ))}
      </div>

      <div className="cover-title-input">
        <div className="field">
          <label htmlFor="bt">Book title</label>
          <input
            id="bt"
            value={title}
            maxLength={40}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Our Year Together"
          />
        </div>
        <div className="field">
          <label htmlFor="bs">Subtitle or year</label>
          <input
            id="bs"
            value={subtitle}
            maxLength={40}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="2026"
          />
        </div>
      </div>
    </div>
  );
}
