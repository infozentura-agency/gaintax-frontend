import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid"><div className="footer-brand"><a className="brand" href="/">GAIN<span>TAX</span></a><p>AI-assisted UK tax research, with source material close at hand.</p></div><div className="footer-col"><strong>PRODUCT</strong><a href="/product">Overview</a><a href="/benchmark">Benchmark</a><a href="/pricing">Pricing</a></div><div className="footer-col"><strong>RESOURCES</strong><a href="/case-study">Customer story</a><a href="/customer-reviews">Reviews</a><a href="/resources">Resources</a></div><div className="footer-col"><strong>TRUST</strong><a href="/trust">Trust Centre</a><a href="/security">Security</a><a href="/sources">Sources</a><a href="/limitations">Responsible use</a></div><div className="footer-col"><strong>COMPANY</strong><a href="/about">About</a><a href="/contact">Contact</a><a href="/faq">FAQ</a></div></div><div className="footer-bottom"><span>© GAIN Tax · GLOBE AI NEURAL TAX LTD</span><div className="footer-legal"><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/dpa">DPA</a><a href="/refund">Refunds</a><a href="/cancellation">Cancellation</a></div></div>
    </footer>
  );
}
