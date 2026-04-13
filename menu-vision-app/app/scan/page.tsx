import { Header } from "@/components/header";
import { ScanFlow } from "@/components/scan-flow";

export default function ScanPage() {
  return (
    <main className="shell page">
      <section className="panel">
        <Header />
        <p className="eyebrow" style={{ marginTop: 24 }}>Scan Flow</p>
        <h1 className="headline" style={{ fontSize: "clamp(2rem, 4vw, 3.6rem)" }}>
          Camera, upload, then layout-aware analysis.
        </h1>
        <p className="subhead">
          This is the MVP interaction model we will wire up to real OCR later. For now it
          documents the behavior and moves users into the demo results state.
        </p>
      </section>
      <ScanFlow />
    </main>
  );
}
