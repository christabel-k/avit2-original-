import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { notifyCartUpdated } from "../../utils/cartUtils";
import "./SearchPage.css";

const categories = [
  { label: "All", value: "all" },
  { label: "Men's Shirts", value: "mens-shirts" },
  { label: "Men's Shoes", value: "mens-shoes" },
  { label: "Men's Watches", value: "mens-watches" },
  { label: "Women's Dresses", value: "womens-dresses" },
  { label: "Women's Shoes", value: "womens-shoes" },
  { label: "Women's Bags", value: "womens-bags" },
  { label: "Tops", value: "tops" },
  { label: "Sunglasses", value: "sunglasses" },
];

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function SearchPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [retry, setRetry] = useState(0);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function getProducts() {
      setLoading(true);
      setError("");

      try {
        let url;

        if (searchTerm.trim()) {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
            searchTerm,
          )}&limit=100`;
        } else if (activeCategory !== "all") {
          url = `https://dummyjson.com/products/category/${activeCategory}`;
        } else {
          url = "https://dummyjson.com/products?limit=30";
        }

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        const data = await response.json();
        let results = data.products || [];

        // Apply category filtering to search results too.
        if (activeCategory !== "all" && searchTerm.trim()) {
          results = results.filter(
            (product) => product.category === activeCategory,
          );
        }

        setProducts(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("We couldn't load the products. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getProducts();

    return () => controller.abort();
  }, [searchTerm, activeCategory, retry]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    if (sortBy === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [products, sortBy]);

  function handleSearch(event) {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    setSearchTerm("");
  }

  function addToCart(product) {
    const cart = readCart();
    const existingProduct = cart.find(
      (item) => item.id === product.id && !item.selectedSize,
    );

    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    notifyCartUpdated();
    setAddedProduct(product.id);
    

    window.setTimeout(() => {
      setAddedProduct(null);
    }, 1600);
  }

  return (
    <main className="avit-search-page">
      <section className="search-hero">
        <div className="search-hero-content">
          <span className="search-eyebrow">THE AVIT COLLECTION</span>
          <h1>
            Find your
            <br />
            <em>next favourite.</em>
          </h1>
          <p>
            Explore thoughtfully selected styles, everyday essentials, and
            pieces made to stand out.
          </p>

          <form className="search-form" onSubmit={handleSearch}>
            <span className="search-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
              </svg>
            </span>

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search clothing, shoes, accessories..."
              aria-label="Search products"
            />

            {searchInput && (
              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

            <button type="submit" className="search-submit">
              Search
            </button>
          </form>

          <div className="search-quick-links">
            <span>Popular:</span>
            {["Shirts", "Dresses", "Shoes", "Watches"].map((term) => (
              <button
                type="button"
                key={term}
                onClick={() => {
                  setSearchInput(term);
                  setSearchTerm(term);
                  setActiveCategory("all");
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

       
      </section>

      <section className="search-results-section">
        <div className="search-section-heading">
          <div>
            <span className="search-eyebrow">EXPLORE AVIT</span>
            <h2>
              {searchTerm
                ? `Results for "${searchTerm}"`
                : activeCategory === "all"
                  ? "Discover our collection"
                  : categories.find((item) => item.value === activeCategory)
                      ?.label}
            </h2>
            <p>Find pieces that fit your style and your everyday.</p>
          </div>

          <label className="search-sort">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="rating">Top rated</option>
              <option value="name">Name: A–Z</option>
            </select>
          </label>
        </div>

        <div className="search-category-list">
          {categories.map((category) => (
            <button
              type="button"
              key={category.value}
              className={activeCategory === category.value ? "active" : ""}
              onClick={() => setActiveCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="search-result-count">
          {loading
            ? "Finding products..."
            : `${sortedProducts.length} ${
                sortedProducts.length === 1 ? "product" : "products"
              } found`}
          {searchTerm && (
            <button type="button" onClick={clearSearch}>
              Clear search
            </button>
          )}
        </div>

        {loading && (
          <div className="search-message">
            <div className="search-loader" />
            <p>Finding something you'll love...</p>
          </div>
        )}

        {!loading && error && (
          <div className="search-message search-error">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setRetry((count) => count + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && sortedProducts.length > 0 && (
          <div className="search-product-grid">
            {sortedProducts.map((product) => (
              <article className="search-product-card" key={product.id}>
                <Link
                  to={`/description/${product.id}`}
                  className="search-product-image"
                >
                  <img src={product.thumbnail} alt={product.title} />
                  {product.discountPercentage > 10 && (
                    <span className="search-product-badge">SPECIAL FIND</span>
                  )}
                </Link>

                <div className="search-product-details">
                  <span className="search-product-category">
                    {product.category.replaceAll("-", " ")}
                  </span>

                  <Link
                    to={`/description/${product.id}`}
                    className="search-product-title"
                  >
                    {product.title}
                  </Link>

                  <div className="search-product-bottom">
                    <span className="search-product-price">
                      ${Number(product.price).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      className={
                        addedProduct === product.id
                          ? "search-add-button added"
                          : "search-add-button"
                      }
                      onClick={() => addToCart(product)}
                      aria-label={`Add ${product.title} to cart`}
                    >
                      {addedProduct === product.id ? "Added ✓" : "Add +"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && sortedProducts.length === 0 && (
          <div className="search-message search-empty">
            <span className="search-empty-icon">⌕</span>
            <h3>No products found</h3>
            <p>
              Try another search term or choose a different category to explore
              more of Avit.
            </p>
            <button type="button" onClick={clearSearch}>
              View all products
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchPage;
