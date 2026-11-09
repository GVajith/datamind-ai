import { ArrowRight, ArrowUpRight, BarChart3, Check, ChevronRight, CircleHelp, Database, Download, FileSpreadsheet, FileText, LayoutDashboard, LogOut, Menu, MessageSquareText, Search, Settings, ShieldCheck, Sparkles, TrendingUp, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { POSTAPI } from "../../../network/API";
import { authAPIRoutes } from "../../../network/Endpoints";
import DataArtwork from "../../common/Artwork/DataArtwork";
import Brand from "../../common/Brand/Brand";
import { clearAuthentication } from "../../store/actions";
import { downloadSampleCsv, formatAmount, sampleRows } from "./sampleData";

const navigation = [
  [LayoutDashboard, "Overview", "overview"],
  [Database, "Data library", "datasets"],
  [MessageSquareText, "Insights", "insights"],
  [FileText, "Reports", "reports"],
  [Settings, "Settings", "settings"],
];

function SampleChart() {
  const [metric, setMetric] = useState("revenue");
  const [selected, setSelected] = useState(5);
  const max = Math.max(...sampleRows.map((row) => row[metric]));
  const total = sampleRows.reduce((sum, row) => sum + row[metric], 0);
  const value = (number) => metric === "revenue" ? formatAmount(number) : number.toLocaleString();
  return (
    <section className="workspace-card chart-card">
      <div className="card-heading"><div><span className="eyebrow">A CLOSER LOOK</span><h2>Small numbers. Bigger picture.</h2></div><span className="tag">SAMPLE DATA</span></div>
      <div className="chart-toolbar"><div><strong>{value(total)}</strong><span>Total {metric} · January–June</span></div><div className="segmented-control" aria-label="Chart metric">{["revenue", "orders"].map((item) => <button key={item} aria-pressed={metric === item} onClick={() => setMetric(item)}>{item === "revenue" ? "Revenue" : "Orders"}</button>)}</div></div>
      <div className="bar-chart" aria-label={`Monthly sample ${metric}`}>
        {sampleRows.map((row, index) => <button key={row.month} className={`chart-column ${selected === index ? "selected" : ""}`} onClick={() => setSelected(index)} aria-pressed={selected === index} aria-label={`${row.month}: ${value(row[metric])}`}><span className="bar-track"><span className="bar-fill" style={{ height: `${row[metric] / max * 100}%` }} /></span><span className="bar-month">{row.short}</span></button>)}
      </div>
      <div className="chart-detail" aria-live="polite"><span><span className="status-dot" />{sampleRows[selected].month}</span><strong>{value(sampleRows[selected][metric])} {metric === "orders" ? "orders" : "revenue"}</strong><span>Click a month to explore</span></div>
    </section>
  );
}

function SampleTable({ query = "" }) {
  const rows = sampleRows.filter((row) => row.month.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="table-scroll">
      <table className="data-table"><caption className="sr-only">Illustrative monthly sales data, not uploaded user data</caption><thead><tr><th>Month</th><th>Revenue (INR)</th><th>Orders</th></tr></thead><tbody>{rows.map((row) => <tr key={row.month}><td>{row.month}</td><td>{formatAmount(row.revenue)}</td><td>{row.orders}</td></tr>)}</tbody></table>
      {rows.length === 0 && <p className="table-no-results">No months match “{query}”. Try another search.</p>}
    </div>
  );
}

export default function Dashboard() {
  const auth = useSelector((state) => state.dataMindReducer.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("overview");
  const [sample, setSample] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const dialogRef = useRef(null);
  const firstName = auth?.user?.full_name?.split(" ")[0] || "there";
  const title = navigation.find((item) => item[2] === view)?.[1] || "Overview";

  useEffect(() => {
    if (dialog && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
    if (!dialog && dialogRef.current?.open) dialogRef.current.close();
  }, [dialog]);

  useEffect(() => {
    const close = (event) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const changeView = (next) => {
    setView(next);
    setQuery("");
    setMenuOpen(false);
  };

  const exploreSample = () => {
    setSample(true);
    changeView("overview");
    setDialog(null);
  };

  const logout = async () => {
    setSigningOut(true);
    try { await POSTAPI(authAPIRoutes.logout); }
    catch { /* Local sign-out remains available when the API is unreachable. */ }
    finally {
      dispatch(clearAuthentication());
      navigate("/", { replace: true });
    }
  };

  const emptyState = (Icon, heading, body) => <div className="workspace-empty"><span className="empty-icon"><Icon size={28} /></span><h3>{heading}</h3><p>{body}</p><button className="button button-outline button-small" onClick={exploreSample}>Explore sample data <ArrowRight size={16} /></button></div>;

  return (
    <div className="workspace">
      <a className="skip-link" href="#workspace-main">Skip to workspace</a>
      {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside id="workspace-navigation" className={`workspace-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand"><Brand light /><button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={19} /></button></div>
        <div className="workspace-selector"><span className="workspace-avatar">{firstName.charAt(0).toUpperCase()}</span><div><strong>Personal workspace</strong><span>Early access</span></div><ShieldCheck size={15} /></div>
        <p className="nav-group-label">YOUR WORKSPACE</p>
        <nav aria-label="Workspace navigation">{navigation.map(([Icon, label, key]) => <button key={key} className={`sidebar-link ${view === key ? "active" : ""}`} onClick={() => changeView(key)} aria-current={view === key ? "page" : undefined}><Icon size={19} /><span>{label}</span>{key === "insights" && <span className="nav-spark"><Sparkles size={13} /></span>}{view === key && <span className="nav-active-dot" />}</button>)}</nav>
        <div className="sidebar-bottom"><div className="sidebar-tip"><Sparkles size={20} /><h3>A little curious?</h3><p>See a simple dataset turn into a clearer picture.</p><button onClick={exploreSample}>Explore a sample <ArrowUpRight size={15} /></button></div><button className="sidebar-link" onClick={() => setDialog("help")}><CircleHelp size={18} /> Help & getting started</button><span className="sidebar-version"><span className="status-dot" /> A thoughtful work in progress</span></div>
      </aside>

      <div className="workspace-body">
        <header className="workspace-header">
          <div className="workspace-breadcrumb"><button className="icon-button workspace-menu" aria-label="Open workspace navigation" aria-expanded={menuOpen} aria-controls="workspace-navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button><span>Workspace</span><ChevronRight size={13} /><strong>{title}</strong></div>
          <div className="workspace-header-actions"><span className="early-badge">EARLY ACCESS</span><button className="profile-trigger" onClick={() => changeView("settings")} aria-label="Open profile settings"><span className="profile-avatar">{firstName.charAt(0).toUpperCase()}</span><span>{firstName}</span></button><button className="icon-button" onClick={logout} disabled={signingOut} aria-label="Sign out"><LogOut size={17} /></button></div>
        </header>

        <main id="workspace-main" className="workspace-content">
          <div className="workspace-title"><div><p className="eyebrow">{view === "overview" ? "A FRESH PERSPECTIVE" : "YOUR PERSONAL WORKSPACE"}</p><h1>{view === "overview" ? `Good to see you, ${firstName}.` : title}</h1><p>{view === "overview" ? "A little curiosity. A clearer picture. What will you discover today?" : "Everything you need, with a little more room to think."}</p></div><button className="button button-dark button-small" onClick={() => setDialog("upload")}><UploadCloud size={17} /> Add a dataset</button></div>

          <div className={`sample-banner ${sample ? "sample-active" : ""}`}><span><Sparkles size={16} /><span>{sample ? "Sample preview is on." : "Your workspace is ready to explore."} <small>{sample ? "Illustrative data only. Your account data stays separate." : "Take a look around with our interactive sample."}</small></span></span><button onClick={() => sample ? setSample(false) : exploreSample()}>{sample ? "Exit sample" : "Try sample data"}<ArrowRight size={15} /></button></div>

          {view === "overview" && <>
            <section className="welcome-card"><div className="welcome-copy"><span className="tag tag-light"><Sparkles size={12} /> MADE FOR YOUR NEXT AHA</span><h2>There’s a story<br />in every spreadsheet.</h2><p>Let your curiosity lead. Start with a sample and discover a new way to see your numbers.</p><button className="button button-white button-small" onClick={exploreSample}>Explore a sample <ArrowUpRight size={16} /></button></div><DataArtwork priority className="welcome-art" /><span className="welcome-index">01 / DISCOVER</span></section>
            <div className="stat-grid">{[[Database, "Datasets", sample ? "1" : "0", "Files in view"], [BarChart3, "Analyses", sample ? "1" : "0", "New perspectives"], [MessageSquareText, "Conversations", "0", "Questions explored"], [FileText, "Reports", "0", "Stories worth sharing"]].map(([Icon, label, value, detail]) => <article key={label} className="stat-card"><span className="stat-icon"><Icon size={19} /></span><span className="stat-label">{label}</span><strong>{value}</strong><span className="stat-detail">{sample ? "Sample workspace" : detail}</span></article>)}</div>
            <div className="workspace-columns"><div>{sample ? <SampleChart /> : <section className="workspace-card"><div className="card-heading"><div><span className="eyebrow">ROOM TO DISCOVER</span><h2>Your datasets</h2></div><button className="text-link" onClick={() => changeView("datasets")}>View library <ArrowUpRight size={14} /></button></div>{emptyState(Database, "A blank canvas, full of possibility.", "Your datasets will find a home here. Explore a sample to see how it feels.")}</section>}</div><section className="workspace-card discovery-card"><span className="feature-icon"><Sparkles size={21} /></span><p className="eyebrow">START WITH A GOOD QUESTION</p><h2>A few sparks<br />of inspiration.</h2><p>See what you can learn from a simple sales dataset.</p>{["Which month performed best?", "How much revenue did we earn?", "How are orders trending?"].map((question) => <button className="prompt-button" key={question} onClick={() => { setSample(true); changeView("insights"); }}>{question}<ArrowUpRight size={15} /></button>)}<div className="discovery-note"><ShieldCheck size={14} /> Sample calculations, clearly explained.</div></section></div>
          </>}

          {view === "datasets" && <section className="workspace-card"><div className="card-heading"><div><span className="eyebrow">YOUR DATA, ORGANIZED</span><h2>{sample ? "Sample sales · 6 rows" : "Data library"}</h2></div>{sample && <button className="button button-outline button-small" onClick={downloadSampleCsv}><Download size={15} /> Download CSV</button>}</div>{sample ? <><div className="dataset-file"><span className="mini-icon"><FileSpreadsheet size={22} /></span><div><strong>sample_sales.csv</strong><span>6 months · 3 columns · Illustrative data</span></div><span className="tag">SAMPLE</span></div><label className="dataset-search"><Search size={17} /><input aria-label="Filter sample by month" placeholder="Find a month…" value={query} onChange={(event) => setQuery(event.target.value)} /></label><SampleTable query={query} /></> : emptyState(Database, "Your next discovery starts here.", "File uploads are coming soon. In the meantime, get to know the workspace with sample data.")}</section>}

          {view === "insights" && (sample ? <><SampleChart /><div className="insight-grid"><article className="workspace-card insight-note"><TrendingUp size={24} /><span className="tag">SAMPLE INSIGHT</span><h2>June leads the way.</h2><p>June has the highest revenue in this sample at <strong>{formatAmount(sampleRows[5].revenue)}</strong>, with {sampleRows[5].orders} orders.</p><details><summary>How was this calculated?</summary><p>Compare the Revenue values across all six monthly records. June has the maximum value, 38,600. This is a deterministic sample calculation, not an AI response.</p></details></article><article className="workspace-card insight-note"><BarChart3 size={24} /><span className="tag">SAMPLE TOTAL</span><h2>The six-month picture.</h2><p><strong>{formatAmount(sampleRows.reduce((sum, row) => sum + row.revenue, 0))}</strong> in total revenue across <strong>{sampleRows.reduce((sum, row) => sum + row.orders, 0).toLocaleString()}</strong> orders.</p><details><summary>See the methodology</summary><p>Sum the Revenue and Orders columns independently over the six included records. No filters are applied. Revenue is shown in INR.</p></details></article></div></> : <section className="workspace-card">{emptyState(MessageSquareText, "Make a little room for insight.", "Live AI conversations are coming soon. Explore the sample to see data-backed insights and their calculations.")}</section>)}

          {view === "reports" && <section className="workspace-card"><div className="card-heading"><div><span className="eyebrow">TAKE YOUR FINDINGS WITH YOU</span><h2>Your reports</h2></div></div>{sample ? <div className="report-preview"><span className="empty-icon"><FileText size={28} /></span><div><span className="tag">SAMPLE EXPORT</span><h3>A six-month sales snapshot.</h3><p>Download the example records as CSV and explore the numbers yourself. PDF reports are coming soon.</p></div><button className="button button-dark button-small" onClick={downloadSampleCsv}><Download size={16} /> Download CSV</button></div> : emptyState(FileText, "Your findings, all in one place.", "Saved reports will appear here. Try a sample CSV export to get a feel for the experience.")}</section>}

          {view === "settings" && <div className="settings-grid"><section className="workspace-card profile-card"><span className="profile-avatar large">{firstName.charAt(0).toUpperCase()}</span><h2>{auth?.user?.full_name}</h2><p>{auth?.user?.email}</p><span className="tag">PERSONAL WORKSPACE</span><dl><div><dt>Full name</dt><dd>{auth?.user?.full_name}</dd></div><div><dt>Email</dt><dd>{auth?.user?.email}</dd></div><div><dt>Account role</dt><dd>{auth?.user?.role || "user"}</dd></div></dl><button className="button button-outline button-small" disabled={signingOut} onClick={logout}><LogOut size={16} /> Sign out of this workspace</button></section><section className="workspace-card preferences-card"><span className="feature-icon"><ShieldCheck size={22} /></span><h2>A space of your own.</h2><p>Your profile is connected to your signed-in account. Profile editing will be available in a future update.</p><div className="preference-item"><div><strong>Sample preview</strong><span>Show illustrative data throughout the workspace.</span></div><button className="toggle-switch" role="switch" aria-checked={sample} aria-label="Sample preview" onClick={() => setSample(!sample)}><span /></button></div><p className="settings-note">Sample data is temporary and never added to your account.</p></section></div>}
          <footer className="workspace-footer"><span><ShieldCheck size={13} /> Your workspace. Your perspective.</span><button onClick={() => setDialog("help")}>A little help? <ArrowUpRight size={13} /></button></footer>
        </main>
      </div>

      <dialog ref={dialogRef} className="workspace-dialog" onCancel={() => setDialog(null)} onClose={() => setDialog(null)} onClick={(event) => { if (event.target === event.currentTarget) setDialog(null); }} aria-labelledby="dialog-title">
        <div className="dialog-content"><button className="icon-button dialog-close" onClick={() => setDialog(null)} aria-label="Close dialog"><X size={20} /></button><span className="empty-icon">{dialog === "upload" ? <UploadCloud size={28} /> : <Sparkles size={28} />}</span><p className="eyebrow">{dialog === "upload" ? "MORE POSSIBILITIES AHEAD" : "A QUICK INTRODUCTION"}</p><h2 id="dialog-title">{dialog === "upload" ? "Your data’s next home." : "Welcome to your workspace."}</h2><p>{dialog === "upload" ? "CSV and Excel uploads are coming soon. You can explore the sample now, compare monthly trends, and download its records." : "Start with the sample to explore charts, inspect individual months, and see how insights are calculated. Your own dataset uploads and live AI conversations will arrive in a future update."}</p><div className="dialog-facts"><span><Check size={15} /> Interactive charts</span><span><Check size={15} /> Clear calculations</span><span><Check size={15} /> CSV export</span></div><button className="button button-teal" onClick={exploreSample}>Explore sample data <ArrowRight size={17} /></button><button className="text-link" onClick={() => setDialog(null)}>Back to my workspace</button></div>
      </dialog>
    </div>
  );
}
