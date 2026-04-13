import type { ScanItem } from "@/data/mock-scan";

const menuText = [
  "Chef Specials",
  "Fish and Chips ................. $18",
  "Beer-battered cod, fries, tartar",
  "",
  "Chicken Fried Steak ............ $21",
  "Country gravy, whipped potatoes",
  "",
  "Clam Chowder .................... $9",
  "Creamy soup with fresh clams"
];

export function OverlayPreview({
  items,
  imagePreviewUrl
}: {
  items: ScanItem[];
  imagePreviewUrl?: string;
}) {
  return (
    <div className="overlay-canvas">
      {imagePreviewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="menu-paper-image" src={imagePreviewUrl} alt="Uploaded menu" />
      ) : (
        <div className="menu-paper">
          <h3>Harbor House Grill</h3>
          {menuText.map((line, index) => (
            <div key={`${index}-${line}`}>{line || <br />}</div>
          ))}
        </div>
      )}
      {items.map((item) => (
        <div
          key={item.id}
          className="overlay-anchor"
          style={{ top: item.layout.top, left: item.layout.left }}
        >
          {item.imageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="mini-thumb-image" src={item.imageDataUrl} alt={item.originalText} />
          ) : (
            <div className="mini-thumb" aria-hidden="true" />
          )}
          <div className="anchor-card">
            <p className="cn">{item.translatedName}</p>
            <p className="result-text">{item.explanation}</p>
            <p className="meta">
              {item.imageType === "web" ? "真实网络图片" : "AI示意图"} · {item.confidence}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
