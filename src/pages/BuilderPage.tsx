import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/shared/Logo";
import { useBook, useBuilder } from "../store/BuilderContext";
import { money } from "../lib/pricing";
import StepFormat from "../components/builder/StepFormat";
import StepCover from "../components/builder/StepCover";
import StepUpload from "../components/builder/StepUpload";
import StepPreview from "../components/builder/StepPreview";
import StepCheckout from "../components/builder/StepCheckout";

const STEPS = ["Size", "Design", "Photos", "Preview", "Order"];

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const { photos, reset } = useBuilder();
  const { price } = useBook();
  const navigate = useNavigate();

  const canNext = step === 2 ? photos.length > 0 : true;
  const lastStep = STEPS.length - 1;

  if (placed) {
    return (
      <div className="builder">
        <Top step={step} />
        <div className="container builder-body">
          <div className="confirm">
            <div className="big">🎉</div>
            <h2>Your memory book is on its way!</h2>
            <p className="muted">
              We’ve emailed your confirmation. Your book is heading to print and
              will ship in 3–5 business days. Thank you for choosing Little
              Chapters.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
              <Link to="/" className="btn btn-ghost">
                Back to home
              </Link>
              <button
                className="btn btn-primary"
                onClick={() => {
                  reset();
                  setPlaced(false);
                  setStep(0);
                }}
              >
                Make another book
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="builder">
      <Top step={step} />

      <div className="container builder-body">
        {step === 0 && <StepFormat />}
        {step === 1 && <StepCover />}
        {step === 2 && <StepUpload />}
        {step === 3 && <StepPreview />}
        {step === 4 && <StepCheckout onPlaceOrder={() => setPlaced(true)} />}
      </div>

      <div className="builder-foot">
        <div className="container builder-foot-inner">
          <button
            className="btn btn-ghost"
            onClick={() => (step === 0 ? navigate("/") : setStep(step - 1))}
          >
            ‹ {step === 0 ? "Exit" : "Back"}
          </button>

          <div className="foot-summary">
            {photos.length > 0 && (
              <>
                {price.pages} pages · <strong>{money(price.total)}</strong>
              </>
            )}
          </div>

          {step < lastStep ? (
            <button
              className="btn btn-primary"
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
            >
              {step === 2
                ? "Preview my book ›"
                : step === 3
                ? "Looks great — order ›"
                : "Continue ›"}
            </button>
          ) : (
            <span className="muted" style={{ fontSize: ".9rem" }}>
              Complete the form to finish →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Top({ step }: { step: number }) {
  return (
    <div className="builder-top">
      <div className="container builder-top-inner">
        <Logo />
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div
                className={`stepper-item ${
                  i === step ? "active" : i < step ? "done" : ""
                }`}
              >
                <span className="stepper-dot">{i < step ? "✓" : i + 1}</span>
                <span className="stepper-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="stepper-sep" />}
            </div>
          ))}
        </div>
        <div style={{ width: 90 }} />
      </div>
    </div>
  );
}
