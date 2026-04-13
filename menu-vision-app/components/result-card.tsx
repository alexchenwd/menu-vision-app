import type { ScanItem } from "@/data/mock-scan";

export function ResultCard({ item }: { item: ScanItem }) {
  return (
    <article className="result-card">
      {item.imageDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="thumb-image" src={item.imageDataUrl} alt={item.originalText} />
      ) : (
        <div className="thumb" aria-hidden="true" />
      )}
      <div>
        <h3 className="result-title">{item.originalText}</h3>
        <p className="result-cn">{item.translatedName}</p>
        <p className="result-text">{item.explanation}</p>
        <p className="result-text">
          Ingredients: {item.possibleIngredients.join(", ")}
        </p>
        <div className="chip-row" style={{ marginTop: 12 }}>
          <span className={`badge ${item.imageType === "web" ? "web" : "ai"}`}>
            {item.imageType === "web" ? "Real Web Image" : "AI Illustration"}
          </span>
          <span className="badge confidence">{item.confidence}</span>
          <span className="badge confidence">{item.priceText}</span>
        </div>
      </div>
    </article>
  );
}
