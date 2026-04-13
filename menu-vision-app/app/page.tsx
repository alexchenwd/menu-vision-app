import Link from "next/link";
import { Header } from "@/components/header";
import { OverlayPreview } from "@/components/overlay-preview";
import { mockScan } from "@/data/mock-scan";

export default function HomePage() {
  return (
    <main className="shell page">
      <section className="hero">
        <Header />
        <p className="eyebrow" style={{ marginTop: 24 }}>
          English Menu In, Chinese Understanding Out
        </p>
        <h1 className="headline">Understand the menu before you order.</h1>
        <p className="subhead">
          Menu Vision scans an English menu, identifies likely dish names,
          translates them into Chinese, explains what each dish is, and places
          image-backed guidance near the original layout when confidence is high.
        </p>
        <div className="button-row">
          <Link href="/scan" className="primary-button">
            Open Scan Flow
          </Link>
          <Link href="/results/demo" className="secondary-button">
            View Overlay Demo
          </Link>
        </div>
        <div className="stats">
          <div className="stat"><div className="stat-label">Primary V1 Input</div><div className="stat-value">English Menus</div></div>
          <div className="stat"><div className="stat-label">Primary Output</div><div className="stat-value">Simplified Chinese</div></div>
          <div className="stat"><div className="stat-label">Result Mode</div><div className="stat-value">Overlay + List</div></div>
        </div>
      </section>

      <section className="grid-two">
        <div className="panel">
          <p className="eyebrow">Product Walkthrough</p>
          <h2 className="screen-title">A tighter MVP, ready to build</h2>
          <p className="screen-copy">
            This scaffold bakes the most important requirements directly into the UI:
            camera or upload entry, OCR-friendly capture, card results, and a
            layout-preserving overlay mode that can gracefully fall back when parsing
            confidence drops.
          </p>
          <div className="screen-section" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <h3 className="screen-title">What this prototype already encodes</h3>
            <div className="chip-row">
              <span className="pill">Common printed menu layouts</span>
              <span className="pill">Dish-name detection</span>
              <span className="pill">Overlay anchors</span>
              <span className="pill">Broad web image sourcing</span>
              <span className="pill">AI fallback labeling</span>
            </div>
          </div>
          <p className="footer-note">
            The actual OCR, Google image retrieval, and LLM translation layers are
            mocked in this starter so we can align on behavior before wiring external
            services.
          </p>
        </div>

        <div className="phone">
          <div className="phone-inner">
            <div className="screen-section">
              <p className="eyebrow">Preview</p>
              <h2 className="screen-title">Overlay-first understanding</h2>
              <p className="screen-copy">
                The user can keep the original menu in view while translated dish chips
                and thumbnails attach near detected dish blocks.
              </p>
            </div>
            <div className="screen-section">
              <div className="preview-frame">
                <div className="preview-menu">
                  <strong>Harbor House Grill</strong><br />
                  Fish and Chips ................. $18<br />
                  Beer-battered cod, fries, tartar<br /><br />
                  Chicken Fried Steak ............ $21<br />
                  Country gravy, whipped potatoes<br /><br />
                  Clam Chowder .................... $9
                </div>
                <div className="preview-chip one"><b>炸鱼薯条</b><span>Real web image · High</span></div>
                <div className="preview-chip two"><b>炸鸡排风味牛排</b><span>AI illustration · Medium</span></div>
                <div className="preview-chip three"><b>蛤蜊浓汤</b><span>Real web image · High</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overlay-card">
        <div className="result-header" style={{ marginBottom: 16 }}>
          <div>
            <p className="eyebrow">Layout Mode</p>
            <h2 className="screen-title" style={{ marginBottom: 0 }}>Overlay rendering on the source menu</h2>
          </div>
          <div className="chip-row">
            <span className="badge confidence">Source: English</span>
            <span className="badge confidence">12 items</span>
            <span className="badge confidence">Confidence: Good</span>
          </div>
        </div>
        <OverlayPreview items={mockScan.items} />
      </section>
    </main>
  );
}
