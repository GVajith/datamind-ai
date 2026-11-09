import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import DataArtwork from "../../common/Artwork/DataArtwork";
import Brand from "../../common/Brand/Brand";

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <section className="auth-form-side">
        <header className="auth-header"><Brand /><Link to="/" className="back-link"><ArrowLeft size={15} /> Back to home</Link></header>
        <div className="auth-form-wrap entrance">
          <span className="auth-symbol"><ShieldCheck size={24} /></span>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          <div className="auth-form-content">{children}</div>
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
        <p className="auth-bottom"><ShieldCheck size={14} /> Your workspace. Your perspective.</p>
      </section>
      <aside className="auth-art-side">
        <div className="auth-art-copy"><span className="eyebrow-pill"><span className="status-dot" /> A FRESH PERSPECTIVE</span><h2>Good decisions<br />start with<br /><em>great questions.</em></h2><p>A little curiosity can change the way you see your data.</p></div>
        <DataArtwork priority className="auth-art" />
        <div className="auth-art-caption"><Check size={16} /><span>Find the signal. Understand the story. Make your next move.</span></div>
      </aside>
    </main>
  );
}
