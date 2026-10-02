
import { useEffect, useState } from "react";
import { notifyCartUpdated } from "../../utils/cartUtils";
import "./HomePage.css";

const BASE_URL = "https://dummyjson.com/products/category/";

const slides = [
  {
    label: "NEW COLLECTION",
    title: "Find Your Perfect Fit.",
    description: "Discover styles made to fit your look.",
    button: "Shop Collection",
    link: "/search",
    image: "/images/men2.png",
  },
  {
    label: "MEN'S COLLECTION",
    title: "Style That Fits You.",
    description: "Discover our latest men's collection.",
    button: "Shop Men",
    link: "/men",
    image: "/images/men3.png",
  },
  {
    label: "MEN'S FIT",
    title: "Know Your Size.",
    description: "Find the right fit before you shop.",
    button: "Find My Fit",
    link: "/find-fit",
    image: "/images/men-fit.png",
  },
  {
    label: "WOMEN'S COLLECTION",
    title: "Made For Your Style.",
    description: "Explore our latest women's collection.",
    button: "Shop Women",
    link: "/women",
    image: "/images/women2.png",
  },
  {
    label: "WOMEN'S COLLECTION",
    title: "Style Made Personal.",
    description: "Discover pieces made to complement your style.",
    button: "Explore Women",
    link: "/women",
    image: "/images/women1.png",
  },
  {
    label: "AVIT FIT",
    title: "Your Fit. Your Style.",
    description: "Let AVIT help you discover your perfect size.",
    button: "Find My Fit",
    link: "/find-fit",
    image: "/images/women-fit.png",
  },
];

const categories = [
  { title: "Men's Shirts", category: "mens-shirts" },
  { title: "Men's Shoes", category: "mens-shoes" },
  { title: "Men's Watches", category: "mens-watches" },
  { title: "Women's Dresses", category: "womens-dresses" },
  { title: "Women's Shoes", category: "womens-shoes" },
  { title: "Women's Bags", category: "womens-bags" },
  { title: "Tops", category: "tops" },
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });


  
   

  // Fetch products from each category
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);

      const results = await Promise.all(
        categories.map(async ({ category }) => {
          try {
            const response = await fetch(
              `${BASE_URL}${category}`,
              { signal: controller.signal }
            );

            if (!response.ok) {
              throw new Error("Failed to load products");
            }

            const data = await response.json();

            return {
              category,
              products: data.products || [],
              error: null,
            };
          } catch (error) {
            if (error.name === "AbortError") {
              return null;
            }

            return {
              category,
              products: [],
              error: "Couldn't load products. Please try again.",
            };
          }
        })
      );

      if (controller.signal.aborted) return;

      const productData = {};
      const errorData = {};

      results.forEach((result) => {
        if (!result) return;

        productData[result.category] = result.products;

        if (result.error) {
          errorData[result.category] = result.error;
        }
      });

      setProducts(productData);
      setErrors(errorData);
      setLoading(false);
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  // Automatically change hero slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Hero slider controls
  const nextSlide = () => {
    setCurrentSlide((previous) => (previous + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (previous) => (previous - 1 + slides.length) % slides.length
    );
  };


    // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    notifyCartUpdated();
  }, [cart]);


  // Add a product to cart
  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <main className="home-page">
      {/* HERO SLIDER */}
      <section className="hero">
        <div
          className="hero-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              className="hero-slide"
              key={slide.label + index}
              style={{ backgroundImage: `url("${slide.image}")` }}
            >
              <div className="hero-overlay"></div>

              <div className="hero-content">
                <p className="hero-label">{slide.label}</p>

                <h1>{slide.title}</h1>

                <p className="hero-description">
                  {slide.description}
                </p>

                <a href={slide.link} className="hero-btn">
                  {slide.button}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* PREVIOUS BUTTON */}
        <button
          className="hero-arrow hero-prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          &#10094;
        </button>

        {/* NEXT BUTTON */}
        <button
          className="hero-arrow hero-next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          &#10095;
        </button>

        {/* SLIDE DOTS */}
        <div className="hero-dots">
          {slides.map((slide, index) => (
            <button
              key={index}
              className={`hero-dot ${
                currentSlide === index ? "active" : ""
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index ? "true" : undefined}
            />
          ))}
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="avit-text">
        <p className="home-eyebrow">WELCOME TO AVIT</p>
        <h2>Get Any Kind of Fashion Style With Avit</h2>
        <p className="intro-description">
          Explore fashion that fits your style, your comfort and your
          personality.
        </p>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="home-products">
        {categories.map(({ title, category }) => (
          <section className="first-rw" key={category}>
            <div className="product-heading">
              <h2>{title}</h2>
              <a href={`/search?category=${category}`}>
                View All <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="image-row">
              {loading && !products[category] ? (
                <p className="product-message">Loading products...</p>
              ) : errors[category] ? (
                <p className="product-message error-message">
                  {errors[category]}
                </p>
              ) : products[category]?.length > 0 ? (
                products[category].map((product) => (
                  <article className="product-card" key={product.id}>
                    <a
                      href={`/description/${product.id}`}
                      className="discript"
                    >
                      <div className="product-image">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          loading="lazy"
                        />
                      </div>

                      <div className="product-info">
                        <h3>{product.title}</h3>
                        <p>${product.price}</p>
                      </div>
                    </a>

                    <button
                      className="add-cart"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </article>
                ))
              ) : (
                !loading && (
                  <p className="product-message">
                    No products available in this category.
                  </p>
                )
              )}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
};

export default HomePage;