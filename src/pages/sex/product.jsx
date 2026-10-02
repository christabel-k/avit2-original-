import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Product.css";

const categoryProducts = {
  men: ["mens-shirts", "mens-shoes", "mens-watches"],
  women: [
    "tops",
    "womens-dresses",
    "womens-shoes",
    "womens-bags",
    "womens-jewellery",
    "womens-watches",
  ],
  kids: [],
};

function Products({ addToCart }) {
  const location = useLocation();

  const category = location.pathname.replace("/", "");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      setProducts([]);

      try {
        const selectedCategories = categoryProducts[category];

        if (!selectedCategories) {
          throw new Error("Invalid product category.");
        }

        if (selectedCategories.length === 0) {
          setLoading(false);
          return;
        }

        const responses = await Promise.all(
          selectedCategories.map((item) =>
            fetch(`https://dummyjson.com/products/category/${item}`),
          ),
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error("Failed to fetch products.");
        }

        const results = await Promise.all(
          responses.map((response) => response.json()),
        );

        const allProducts = results.flatMap((result) => result.products);
        setProducts(allProducts);
      } catch (err) {
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (!categoryProducts[category]) {
    return <p className="products-message">Category not found.</p>;
  }

  return (
    <section className="shop-section">
      <div className="shop-header">
        <p className="shop-eyebrow">AVIT COLLECTION</p>
        <h1>
          {category.charAt(0).toUpperCase() + category.slice(1)}'s Collection
        </h1>
        <p>Explore our latest collection.</p>
      </div>

      {loading && <p className="products-message">Loading products...</p>}

      {error && <p className="products-message">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="products-message">
          Products for this category are not available yet.
        </p>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <img src={product.thumbnail} alt={product.title} loading="lazy" />

            <div className="product-info">
              <h3>{product.title}</h3>

              <p className="product-price">${product.price.toFixed(2)}</p>

              <button className="add-cart" onClick={() => addToCart?.(product)}>
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Products;
