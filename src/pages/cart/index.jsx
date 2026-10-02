import { useEffect, useState } from "react";
import { notifyCartUpdated } from "../../utils/cartUtils";
import "./CartPage.css";

function CartPage() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // Save every cart change to localStorage
  useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
  notifyCartUpdated();
}, [cart]);

  // Calculate the total price of all items
  const total = cart.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  // Increase product quantity
  function increaseQuantity(id) {
    setCart((currentCart) =>
      currentCart.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      ),
    );
  }

  // Decrease quantity, or remove the item if quantity is 1
  function decreaseQuantity(id) {
    setCart((currentCart) =>
      currentCart
        .map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product,
        )
        .filter((product) => product.quantity > 0),
    );
  }

  // Remove one product
  function removeItem(id) {
    setCart((currentCart) =>
      currentCart.filter((product) => product.id !== id),
    );
  }

  // Clear the entire cart
  function clearCart() {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?",
    );

    if (confirmClear) {
      setCart([]);
    }
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-heading">
          <div>
            <span className="cart-eyebrow">YOUR SELECTION</span>
            <h1>Shopping Cart</h1>
            <p className="cart-subtitle">
              Review your items before proceeding to checkout.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              className="clear-cart-btn"
              onClick={clearCart}
              type="button"
            >
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <span>🛍</span>
            </div>

            <h2>Your cart is empty.</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>

            <a href="/" className="continue-shopping-btn">
              Continue Shopping <span>→</span>
            </a>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((product) => (
                <article className="cart-item" key={product.id}>
                  <div className="cart-image-wrap">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="cart-product-image"
                    />
                  </div>

                  <div className="cart-details">
                    <div className="cart-product-info">
                      <h2>{product.title}</h2>

                      {product.selectedSize && (
                        <p className="cart-selected-size">
                          Size: <strong>{product.selectedSize}</strong>
                        </p>
                      )}

                      <p className="cart-unit-price">
                        Unit price: ${Number(product.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(product.id)}
                          aria-label={`Decrease quantity of ${product.title}`}
                        >
                          −
                        </button>

                        <span>{product.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(product.id)}
                          aria-label={`Increase quantity of ${product.title}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => removeItem(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-price">
                    <span>Subtotal</span>
                    <strong>
                      ${(Number(product.price) * product.quantity).toFixed(2)}
                    </strong>
                  </div>
                </article>
              ))}
            </div>

            <section className="cart-summary">
              <div className="summary-top">
                <div>
                  <span className="summary-label">ORDER SUMMARY</span>
                  <h2>Cart Total</h2>
                </div>

                <strong className="summary-total">${total.toFixed(2)}</strong>
              </div>

              <p className="summary-note">
                Shipping and any applicable fees will be calculated at checkout.
              </p>

              <a href="/payment" className="checkout-btn">
                Proceed to Checkout <span>→</span>
              </a>

              <a href="/" className="back-to-shopping">
                Continue Shopping
              </a>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default CartPage;
