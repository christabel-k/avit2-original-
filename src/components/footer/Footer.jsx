import "./Footer.css";

const Footer = () => {

return (
<footer className="avit-footer">
  <div className="footer-content">
    <div className="footer-brand">
      <h2>Avit<span>.</span></h2>
      <p>Style that fits you. Fashion made personal.</p>
    </div>

    <div className="footer-links">
      <h3>Quick Links</h3>
      <a href="/">Home</a>
      <a href="/search">Shop</a>
      <a href="/find-fit">Find My Fit</a>
      <a href="/payment">Payment</a>
    </div>

    <div className="footer-links">
      <h3>Customer Care</h3>
      <a href="/#contact">Contact Us</a>
      <a href="/#faq">FAQs</a>
      <a href="/#shipping">Shipping & Returns</a>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2026 Avit. All rights reserved.</p>
    <p>Designed with care for your style.</p>
  </div>
</footer>

)
}

export default Footer;