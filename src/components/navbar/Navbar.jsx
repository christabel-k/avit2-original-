import { useState } from "react";
import "./Navbar.css";



function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");


  const products = [
    "Classic T-Shirt",
    "Oversized Hoodie",
    "Cargo Pants",
    "Denim Jacket",
    "Sneakers",
    "Summer Dress",
  ];

  const getSuggestions = (value) => {
    if (!value.trim()) return [];

    return products.filter((product) =>
      product.toLowerCase().includes(value.toLowerCase()),
    );
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Kids", href: "/kids" },
  ];

  return (
    <header className="avit-header">
      {/* Desktop Navbar */}
      <nav className="navbar">
        <a href="/" className="logo">
          <h1>Avit</h1>
        </a>

        <div className="gender">
          {navLinks.map((link) => (
            <a href={link.href} key={link.name}>
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Search */}
        <div className="srch-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            aria-hidden="true"
          >
            <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
          </svg>

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />

          {search && (
            <div className="search-dropdown">
              {getSuggestions(search).length > 0 ? (
                getSuggestions(search).map((product) => (
                  <a
                    href={`/search?q=${encodeURIComponent(product)}`}
                    key={product}
                  >
                    {product}
                  </a>
                ))
              ) : (
                <p>No products found</p>
              )}
            </div>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="actions">
          <a href="/find-fit" className="fit-btn">
            Find My Fit
          </a>

          <a href="/cart" className="cart-btn">
            <span aria-hidden="true">🛒</span> Cart
            <span className="cart-count">{cartCount}</span>
          </a>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <section className="media-nav">
        <div className="mobile-top">
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <a href="/" className="logo">
            <h1>Avit</h1>
          </a>

          <div className="mobile-actions">
            <a href="/find-fit" className="fit-btn">
              Find My Fit
            </a>

            <a href="/cart" className="cart-btn">
              🛒 <span className="cart-count">{cartCount}</span>
            </a>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="srch-bar mobile-search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            aria-hidden="true"
          >
            <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.8 579.2 554.1 566.7 566.6C554.2 579.1 533.9 579.1 521.4 566.6L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
          </svg>

          <input
            type="text"
            placeholder="Search product..."
            value={mobileSearch}
            onChange={(e) => setMobileSearch(e.target.value)}
            aria-label="Search products"
          />

          {mobileSearch && (
            <div className="search-dropdown">
              {getSuggestions(mobileSearch).length > 0 ? (
                getSuggestions(mobileSearch).map((product) => (
                  <a
                    href={`/search?q=${encodeURIComponent(product)}`}
                    key={product}
                  >
                    {product}
                  </a>
                ))
              ) : (
                <p>No products found</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Mobile Menu */}
      <div className={`navka ${menuOpen ? "show-menu" : ""}`}>
        <div className="gender">
          {navLinks.map((link) => (
            <a
              href={link.href}
              key={link.name}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
