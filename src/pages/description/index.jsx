import { useEffect, useState } from "react";
import { notifyCartUpdated } from "../../utils/cartUtils";
import "./DescriptionPage.css";

function DescriptionPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [userFit, setUserFit] = useState(null); 

  // Supports an id in the query string or as the last URL segment.
  const params = new URLSearchParams(window.location.search);
  const productId =
    params.get("id") ||
    window.location.pathname.split("/").filter(Boolean).pop();

  useEffect(() => {
    try {
      const savedFit = JSON.parse(localStorage.getItem("userFit"));
      setUserFit(savedFit);
    } catch {
      setUserFit(null);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function getProduct() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://dummyjson.com/products/${encodeURIComponent(productId)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("We couldn't find this product.");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (productId) {
      getProduct();
    } else {
      setError("No product was selected.");
      setLoading(false);
    }

    return () => controller.abort();
  }, [productId]);

  const category = product?.category?.toLowerCase() || "";

  const isClothing =
    category.includes("shirt") ||
    category.includes("top") ||
    category.includes("dress") ||
    category.includes("jean") ||
    category.includes("pant") ||
    category.includes("trouser") ||
    category.includes("hoodie") ||
    category.includes("jacket");

  let recommendedSize = "Not available";

  if (userFit && product) {
    if (
      category.includes("shirt") ||
      category.includes("top") ||
      category.includes("dress") ||
      category.includes("hoodie") ||
      category.includes("jacket")
    ) {
      recommendedSize = userFit.shirtSize || "Not available";
    } else if (
      category.includes("jean") ||
      category.includes("pant") ||
      category.includes("trouser")
    ) {
      recommendedSize = userFit.trouserSize || "Not available";
    }
  }

  function addToCart() {
    if (!product) return;

    if (isClothing && !selectedSize) {
      window.alert("Please choose a size before adding this item to your cart.");
      return;
    }

    let cart = [];

    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      cart = [];
    }

    // Keep different sizes as separate cart items.
    const existingItem = cart.find(
      (item) =>
        item.id === product.id &&
        (item.selectedSize || "") === (selectedSize || "")
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
        ...(selectedSize ? { selectedSize } : {}),
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    notifyCartUpdated();
    setAdded(true);
    
  }

  if (loading) {
    return (
      <main className="description-page">
        <div className="product-state">
          <div className="product-loader" />
          <p>Preparing your product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="description-page">
        <div className="product-state">
          <span className="state-eyebrow">AVIT COLLECTION</span>
          <h1>Product unavailable</h1>
          <p>{error || "This product could not be loaded."}</p>
          <a href="/" className="details-back-link">
            ← Back to shopping
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="description-page">
      <div className="details-container">
        <div className="details-breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="breadcrumb-current">{product.title}</span>
        </div>

        <section className="product-detail-layout">
          <div className="detail-image-panel">
            <span className="image-label">AVIT EDITION</span>
            <div className="detail-image">
              <img src={product.thumbnail} alt={product.title} />
            </div>
            <p className="image-caption">
              Considered style. Made for your everyday.
            </p>
          </div>

          <div className="detail-info-panel">
            <span className="detail-category">
              {product.category?.replaceAll("-", " ")}
            </span>

            <h1>{product.title}</h1>

            <div className="detail-rating">
              <span className="rating-star">★</span>
              <strong>{Number(product.rating || 0).toFixed(1)}</strong>
              <span className="rating-caption">Customer rating</span>
            </div>

            <div className="detail-price">
              ${Number(product.price).toFixed(2)}
            </div>

            <div className="detail-divider" />

            <p className="detail-description">{product.description}</p>

            <div className="detail-meta">
              <p>
                <span>Brand</span>
                <strong>{product.brand || "Avit Collection"}</strong>
              </p>
              <p>
                <span>Category</span>
                <strong>{product.category?.replaceAll("-", " ")}</strong>
              </p>
              {product.availabilityStatus && (
                <p>
                  <span>Availability</span>
                  <strong>{product.availabilityStatus}</strong>
                </p>
              )}
            </div>

            {userFit && isClothing && (
              <div className="ai-fit-box">
                <div className="fit-box-heading">
                  <div className="fit-sparkle">✦</div>
                  <div>
                    <span>PERSONALIZED FOR YOU</span>
                    <h2>AI Fit Recommendation</h2>
                  </div>
                </div>

                <div className="fit-recommendation">
                  <div>
                    <span>Recommended size</span>
                    <strong>{recommendedSize}</strong>
                  </div>
                  <span className="fit-match">Your saved fit</span>
                </div>

                <p>
                  {recommendedSize !== "Not available"
                    ? `Based on your saved fit information, size ${recommendedSize} is recommended for this item.`
                    : "Your saved fit profile does not contain a size for this product category."}
                </p>
              </div>
            )}

            {!userFit && isClothing && (
              <a href="/find-fit" className="fit-guide-link">
                ✦ Find your size with Avit Fit Guide <span>→</span>
              </a>
            )}

            {isClothing && (
              <div className="size-selector">
                <div className="size-heading">
                  <h2>Choose your size</h2>
                  <a href="/find-fit">Size guide</a>
                </div>

                <div className="size-options">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={selectedSize === size ? "size-btn selected" : "size-btn"}
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="detail-add-cart"
              onClick={addToCart}
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
              {!added && <span>→</span>}
            </button>

            <p className="detail-footnote">
              A considered addition to your wardrobe.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DescriptionPage;