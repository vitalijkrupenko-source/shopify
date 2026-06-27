import { useRef, useState } from "react";
import { useBuilder, useBook } from "../../store/BuilderContext";
import { filesToPhotos } from "../../lib/image";

export default function StepUpload() {
  const {
    photos,
    addPhotos,
    removePhoto,
    movePhoto,
    captions,
    setCaption,
    formatId,
  } = useBuilder();
  const { book } = useBook();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | File[]) {
    setBusy(true);
    const newPhotos = await filesToPhotos(files);
    addPhotos(newPhotos);
    setBusy(false);
  }

  const showCaptions = formatId === "small";

  return (
    <div className="uploader">
      <div className="step-head">
        <h2>Upload your favorite photos</h2>
        <p>
          Drag them in from your phone or computer. Vertical photos are welcome —
          they look great.
        </p>
      </div>

      <div
        className={`dropzone ${drag ? "drag" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="big">📸</div>
        <h3 style={{ margin: "0 0 6px" }}>
          {busy ? "Adding your photos…" : "Drop photos here"}
        </h3>
        <p className="muted" style={{ margin: 0 }}>
          or <strong style={{ color: "var(--coral-deep)" }}>browse</strong> — JPG,
          PNG &amp; HEIC welcome
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <>
          <div className="upload-meta">
            <span className="chip">
              {photos.length} photo{photos.length === 1 ? "" : "s"} ·{" "}
              {book.photoPageCount} page{book.photoPageCount === 1 ? "" : "s"}
            </span>
            <span className="muted" style={{ fontSize: ".9rem" }}>
              Tip: use the arrows to reorder — that’s the order they’ll appear.
            </span>
          </div>

          <div className="upload-grid">
            {photos.map((p, i) => (
              <div key={p.id}>
                <div className="thumb">
                  <img src={p.url} alt={p.name} />
                  <div className="order">{i + 1}</div>
                  <button
                    className="rm"
                    onClick={() => removePhoto(p.id)}
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                  <div className="move">
                    <button onClick={() => movePhoto(p.id, -1)} aria-label="Move left">
                      ‹
                    </button>
                    <button onClick={() => movePhoto(p.id, 1)} aria-label="Move right">
                      ›
                    </button>
                  </div>
                </div>
                {showCaptions && (
                  <input
                    value={captions[p.id] || ""}
                    onChange={(e) => setCaption(p.id, e.target.value)}
                    placeholder="Add caption…"
                    style={{
                      width: "100%",
                      marginTop: 6,
                      border: "1.5px solid var(--line)",
                      borderRadius: 8,
                      padding: "6px 8px",
                      fontSize: ".82rem",
                      fontFamily: "inherit",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {photos.length === 0 && !busy && (
        <p className="empty-hint">
          Add at least a few photos to start building your book ✨
        </p>
      )}
    </div>
  );
}
