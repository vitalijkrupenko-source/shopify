import { useBuilder } from "../../store/BuilderContext";
import { FORMAT_LIST } from "../../data/config";
import { money } from "../../lib/pricing";

export default function StepFormat() {
  const { formatId, setFormatId } = useBuilder();
  return (
    <div>
      <div className="step-head">
        <h2>Choose your book size</h2>
        <p>Both are made for vertical iPhone photos — pick the feel you want.</p>
      </div>
      <div className="fmt-select">
        {FORMAT_LIST.map((f) => (
          <button
            key={f.id}
            className={`fmt-opt ${formatId === f.id ? "selected" : ""}`}
            onClick={() => setFormatId(f.id)}
          >
            <div className="format-tag">{f.tag}</div>
            <h3>{f.name}</h3>
            <p className="muted" style={{ margin: "0 0 14px" }}>{f.dimensions}</p>
            <p className="muted">{f.description}</p>
            <ul className="format-feats">
              {f.features.map((feat) => (
                <li key={feat}>{feat}</li>
              ))}
            </ul>
            <div className="format-price">
              {money(f.basePrice)}
              <small> · {f.includedPages} pages included</small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
