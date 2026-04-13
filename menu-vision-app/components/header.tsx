import Link from "next/link";

export function Header() {
  return (
    <div className="panel-header">
      <Link href="/" className="eyebrow">
        Menu Vision
      </Link>
      <div className="chip-row">
        <Link href="/scan" className="chip-button">
          Scan Flow
        </Link>
        <Link href="/results/demo" className="chip-button">
          Demo Results
        </Link>
      </div>
    </div>
  );
}
