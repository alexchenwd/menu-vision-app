import { Header } from "@/components/header";
import { OverlayPreview } from "@/components/overlay-preview";
import { ResultCard } from "@/components/result-card";
import { getScanById } from "@/lib/scan-store";
import { notFound } from "next/navigation";

export default async function ResultsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scan = getScanById(id);

  if (!scan) {
    notFound();
  }

  const featured = scan.items[1] ?? scan.items[0];

  return (
    <main className="shell page">
      <section className="panel">
        <Header />
        <div className="result-header" style={{ marginTop: 24 }}>
          <div>
            <p className="eyebrow">Scan Results</p>
            <h1 className="screen-title" style={{ fontSize: "2.2rem", marginBottom: 4 }}>{scan.restaurantName}</h1>
            <p className="muted">Source: {scan.sourceLanguage} · Output: {scan.targetLanguage}</p>
          </div>
          <div className="chip-row">
            <span className="badge confidence">{scan.itemsFound} items</span>
            <span className="badge confidence">Confidence: {scan.overallConfidence}</span>
            <span className="badge confidence">Overlay Ready</span>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <section className="overlay-card">
          <div className="panel-header" style={{ marginBottom: 16 }}>
            <div className="chip-row">
              <button className="primary-button" type="button">Overlay</button>
              <button className="ghost-button" type="button">List</button>
            </div>
            <p className="muted">Chips attach near OCR anchors when layout confidence is high.</p>
          </div>
          <OverlayPreview
            items={scan.items}
            imagePreviewUrl={scan.imagePreviewUrl}
          />
        </section>

        <section className="detail-card">
          <p className="eyebrow">Selected Dish</p>
          <div className="detail-grid">
            {featured.imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="detail-hero-image"
                src={featured.imageDataUrl}
                alt={featured.originalText}
              />
            ) : (
              <div className="detail-hero" aria-hidden="true" />
            )}
            <div>
              <h2 className="detail-title">{featured.originalText}</h2>
              <p className="result-cn" style={{ marginTop: 8 }}>{featured.translatedName}</p>
              <p className="result-text">{featured.explanation}</p>
              {featured.note ? <p className="result-text" style={{ marginTop: 10 }}>{featured.note}</p> : null}
              <div className="chip-row" style={{ marginTop: 12 }}>
                <span className={`badge ${featured.imageType === "web" ? "web" : "ai"}`}>
                  {featured.imageType === "web" ? "Real Web Image" : "AI Illustration"}
                </span>
                <span className="badge confidence">{featured.priceText}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <p className="eyebrow">Likely Ingredients</p>
            <div className="inline-list">
              {featured.possibleIngredients.map((ingredient) => (
                <span key={ingredient} className="pill">{ingredient}</span>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section className="panel">
        {scan.warning ? (
          <p style={{ color: "var(--accent)", marginTop: 0 }}>{scan.warning}</p>
        ) : null}
        <div className="panel-header" style={{ marginBottom: 18 }}>
          <div>
            <p className="eyebrow">Fallback Mode</p>
            <h2 className="screen-title" style={{ marginBottom: 0 }}>Card results when overlay confidence is low</h2>
          </div>
          <p className="muted">The user should never be forced into a broken overlay.</p>
        </div>
        <div className="result-list">
          {scan.items.map((item) => (
            <ResultCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
