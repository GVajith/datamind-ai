import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Brand from "../Brand/Brand";

const links = [["Why DataMind", "#features"], ["How it works", "#how-it-works"], ["Pricing", "#pricing"], ["FAQs", "#faq"]];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <header className="public-header">
      <div className="site-width header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <Link to="/sign-in" className="text-link">Log in</Link>
          <Link to="/sign-up" className="button button-dark button-small">Get started <ArrowUpRight size={16} /></Link>
        </div>
        <button className="icon-button mobile-menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <Link to="/sign-in">Log in</Link>
          <Link to="/sign-up" className="button button-dark">Create your account <ArrowUpRight size={16} /></Link>
        </nav>
      )}
    </header>
  );
}
