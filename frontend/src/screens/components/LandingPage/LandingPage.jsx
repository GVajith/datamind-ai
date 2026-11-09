import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, BarChart3, Check, CheckCheck, ChevronDown, Database, FileSpreadsheet, Layers3, MessageSquareText, MousePointer2, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";

import DataArtwork from "../../common/Artwork/DataArtwork";
import Brand from "../../common/Brand/Brand";
import PublicHeader from "../../common/PublicHeader/PublicHeader";

const faqs = [
  ["Do I need to know SQL or Python?", "No. DataMind is designed around everyday questions. The workspace preview shows how a question can become a clear, visual answer without writing code."],
  ["What can I try today?", "You can create an account, explore your workspace, and interact with the built-in sample dataset. File uploads and live AI analysis are coming soon."],
  ["Which file types will be supported?", "CSV and Excel workbooks are planned, with a configurable 50 MB upload limit. DataMind will inspect the columns in each file instead of assuming a fixed template."],
  ["How are calculations checked?", "The planned analysis engine uses approved data-processing tools to calculate results. AI will interpret those results, and the methodology will remain visible alongside each answer."],
];

export default function LandingPage() {
  return (
    <div className="marketing-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <PublicHeader />
      <main id="main-content">
        <section className="hero site-width">
          <div className="hero-copy entrance">
            <div className="eyebrow-pill"><span className="status-dot" /> A little intelligence. A lot of clarity.</div>
            <h1>Your data has<br />a story.<br /><span>Let’s uncover it.</span></h1>
            <p>From complex spreadsheets to your next big decision. A calmer, smarter way to explore your data—one question at a time.</p>
            <div className="hero-buttons">
              <Link to="/sign-up" className="button button-teal">Start your workspace <ArrowUpRight size={18} /></Link>
              <a href="#how-it-works" className="button button-outline">Take a closer look <ArrowDown size={16} /></a>
            </div>
            <div className="hero-assurances"><span><Check size={14} /> Free early access</span><span><Check size={14} /> No credit card</span></div>
          </div>
          <div className="hero-stage entrance entrance-delay">
            <div className="stage-caption"><span className="status-dot" /> A NEW PERSPECTIVE ON DATA</div>
            <DataArtwork priority className="hero-art" />
            <div className="floating-note note-source"><span className="mini-icon"><FileSpreadsheet size={18} /></span><div><strong>It starts with a spreadsheet.</strong><span>Possibilities inside every row</span></div></div>
            <div className="floating-note note-insight"><span className="mini-icon dark"><Sparkles size={18} /></span><div><span>A clearer picture</span><strong>More insight. Less guesswork.</strong></div><ArrowUpRight size={18} /></div>
            <div className="stage-footnote"><MousePointer2 size={13} /> Built for curious minds. Designed for real decisions.</div>
          </div>
        </section>

        <div className="capability-strip site-width"><span>FROM RAW DATA TO REAL UNDERSTANDING</span><div><FileSpreadsheet size={17} /> CSV & Excel</div><div><MessageSquareText size={17} /> Natural language</div><div><BarChart3 size={17} /> Visual insights</div><div><ShieldCheck size={17} /> Private workspace</div></div>

        <section id="features" className="section site-width">
          <div className="section-heading"><div><p className="eyebrow">LESS FRICTION. MORE DISCOVERY.</p><h2>Make room for<br />your next <em>“aha.”</em></h2></div><p>Bring your questions. We’re building the tools to help you find the signal, understand the why, and move forward with confidence.</p></div>
          <div className="feature-grid">
            <article className="feature-card feature-conversation"><span className="feature-icon"><MessageSquareText size={22} /></span><h3>A conversation,<br />not a query.</h3><p>Ask the question that’s on your mind. Then go a little deeper with a follow-up.</p><div className="example-chat"><div className="example-question">What’s driving our growth?<ArrowUpRight size={15} /></div><div className="example-answer"><Sparkles size={17} /><span>Let’s look at the story behind the numbers.</span></div><span className="example-label">Illustrative conversation</span></div></article>
            <article className="feature-card feature-visual"><span className="feature-icon"><Layers3 size={22} /></span><h3>Clarity you<br />can actually see.</h3><p>Explore patterns, compare categories, and turn numbers into something meaningful.</p><div className="feature-mini-bars" aria-hidden="true">{[34, 53, 43, 72, 60, 94].map((value, index) => <div key={index} style={{ height: `${value}%` }} />)}</div><span className="example-label">Illustrative trend</span></article>
            <article className="feature-card feature-trust"><span className="feature-icon"><ShieldCheck size={22} /></span><h3>Confidence,<br />built in.</h3><p>Real calculations first. Clear explanations next. A little more certainty in every decision.</p><div className="verification-stack"><div><CheckCheck size={17} /><span>Data-backed calculations</span></div><div><CheckCheck size={17} /><span>Transparent methodology</span></div><div><CheckCheck size={17} /><span>Your own private workspace</span></div></div></article>
          </div>
        </section>

        <section id="how-it-works" className="workflow-section">
          <div className="site-width workflow-inner"><div><p className="eyebrow">AN EASIER WAY IN</p><h2>Big questions.<br /><em>Simple beginnings.</em></h2><p>Get familiar with your workspace today. Explore a sample while we build the next chapter.</p><Link to="/sign-up" className="button button-white">Find your first insight <ArrowUpRight size={17} /></Link></div><div className="workflow-steps">{[[Database,"01","Bring your curiosity","Open a workspace and explore the included sample data."],[AudioLines,"02","Follow the numbers","Compare the sample’s revenue and orders with a single click."],[WandSparkles,"03","See what’s possible","Preview the charts and insights your future analyses can become."]].map(([Icon,num,title,body]) => <article key={num}><span className="step-number">{num}</span><div><h3><Icon size={18} />{title}</h3><p>{body}</p></div></article>)}</div></div>
        </section>

        <section id="pricing" className="section site-width pricing-section"><div><p className="eyebrow">GROW WITH US</p><h2>Your next chapter<br />starts <em>here.</em></h2><p>Try the workspace, discover the sample experience, and help shape a more thoughtful way to work with data.</p></div><article className="pricing-card"><div className="pricing-top"><span className="tag">EARLY ACCESS</span><Sparkles size={24} /></div><h3>A fresh perspective.</h3><div className="price">Free<span>to explore</span></div><ul><li><Check size={16} /> Your personal workspace</li><li><Check size={16} /> Interactive sample-data preview</li><li><Check size={16} /> A first look at what’s next</li></ul><Link to="/sign-up" className="button button-dark">Create your account <ArrowRight size={17} /></Link><p>Uploads and live AI analysis are coming soon.</p></article></section>

        <section id="faq" className="section site-width faq-section"><div><p className="eyebrow">GOOD QUESTIONS</p><h2>A little more<br /><em>clarity.</em></h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} /></summary><p>{answer}</p></details>)}</div></section>
        <section className="site-width"><div className="closing-cta"><div><span className="eyebrow">YOUR DATA. YOUR NEXT MOVE.</span><h2>Curiosity looks good on you.</h2></div><Link to="/sign-up" className="button button-teal">Let’s get started <ArrowUpRight size={18} /></Link></div></section>
      </main>
      <footer className="site-width footer"><Brand /><span>Thoughtfully built for clearer decisions.</span><a href="#faq">Have a question? <ArrowUpRight size={14} /></a><small>© {new Date().getFullYear()} DataMind AI</small></footer>
    </div>
  );
}
