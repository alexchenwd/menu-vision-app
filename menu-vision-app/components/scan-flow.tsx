"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ScanState = "idle" | "submitting" | "error";

export function ScanFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ScanState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;

    setSelectedFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function submitScan() {
    if (!selectedFileName) {
      setErrorMessage("Choose or capture a menu photo first.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const response = await fetch("/api/scans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName: selectedFileName,
        imagePreviewUrl: previewUrl ?? undefined
      })
    });

    if (!response.ok) {
      setStatus("error");
      setErrorMessage("We couldn't start the scan. Please try again.");
      return;
    }

    const data = (await response.json()) as { scanId: string };
    router.push(`/results/${data.scanId}`);
  }

  return (
    <section className="grid-two">
      <div className="phone">
        <div className="phone-inner">
          <div className="screen-section">
            <p className="eyebrow">Step 1</p>
            <h2 className="screen-title">Capture one menu section</h2>
            <p className="screen-copy">
              Fill the frame with a single printed menu section for better OCR
              and dish-name grouping.
            </p>
          </div>
          <div className="screen-section">
            <div className="preview-frame">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Selected menu preview"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div className="preview-menu">
                  <strong>Preview your menu here</strong>
                  <br />
                  Upload an image from your phone or use the camera to simulate
                  the first scan experience.
                </div>
              )}
            </div>
          </div>
          <div className="screen-section">
            <div className="button-row" style={{ marginTop: 0 }}>
              <button
                className="ghost-button"
                type="button"
                onClick={() => cameraInputRef.current?.click()}
              >
                Use Camera
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={submitScan}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Analyzing..." : "Start Analysis"}
              </button>
            </div>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={(event) =>
                void handleFile(event.currentTarget.files?.[0] ?? null)
              }
            />
            <input
              ref={cameraInputRef}
              hidden
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) =>
                void handleFile(event.currentTarget.files?.[0] ?? null)
              }
            />
          </div>
        </div>
      </div>
      <div className="panel">
        <p className="eyebrow">Step 2</p>
        <h2 className="screen-title">What happens next</h2>
        <div className="result-list">
          <div className="stat">
            <div className="stat-label">Reading text</div>
            <div className="screen-copy">
              OCR extracts text blocks, prices, and geometry.
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Detecting dish names</div>
            <div className="screen-copy">
              The parser separates likely dish names from descriptions and
              section headers.
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Rendering results</div>
            <div className="screen-copy">
              High-confidence layouts get overlay mode; low-confidence layouts
              fall back to cards.
            </div>
          </div>
        </div>
        <div className="screen-section" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="stat-label">Selected file</div>
          <p className="screen-copy">
            {selectedFileName ?? "No file chosen yet"}
          </p>
        </div>
        {errorMessage ? (
          <p style={{ color: "var(--accent)", margin: 0 }}>{errorMessage}</p>
        ) : null}
        <p className="footer-note">
          Real OCR and translation are enabled when `OPENAI_API_KEY` is set on
          the server. Without it, this flow falls back to a mocked analysis
          result.
        </p>
      </div>
    </section>
  );
}
