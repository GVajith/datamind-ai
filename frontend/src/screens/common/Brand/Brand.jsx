import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand({ light = false }) {
  return (
    <Link to="/" className={`brand ${light ? "brand-light" : ""}`} aria-label="DataMind AI home">
      <span className="brand-mark"><BarChart3 size={20} strokeWidth={2.5} /></span>
      <span>DataMind<span className="brand-ai">AI</span></span>
    </Link>
  );
}
