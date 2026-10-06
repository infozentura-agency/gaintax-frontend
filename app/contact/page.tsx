import { FiArrowUpRight } from 'react-icons/fi';
export default function Contact() {
  return (
    <main>
      <section className="page-hero"><p className="eyebrow">CONTACT</p><h1>Let’s talk about<br /><span>your tax work.</span></h1><p className="lede">Ask about the product, plans, security information or a conversation with the team.</p></section><section className="contact-layout"><div className="contact-note"><p className="eyebrow">SPEAK WITH THE TEAM</p><h2>Start a conversation.</h2><p>Send a note and the GAIN Tax team can direct your question to the right place.</p><a className="email-link" href="mailto:support@gaintax.co.uk">support@gaintax.co.uk <span><FiArrowUpRight /></span></a></div><div className="contact-detail"><span>PRODUCT</span><p>Explore the <a href="/product">product overview</a> or compare <a href="/pricing">plans and pricing</a>.</p><span>TRUST & SECURITY</span><p>Review the <a href="/security">security overview</a> and <a href="/trust">Trust Centre</a>.</p><span>GENERAL ENQUIRIES</span><p>GLOBE AI NEURAL TAX LTD<br />128 City Road<br />London EC1V 2NX<br />England</p></div></section>
    </main>
  );
}
