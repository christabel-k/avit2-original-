
import { useState } from "react";
import "./PaymentPage.css";

const WHATSAPP_NUMBER = "2348137192759"; // Replace with your actual business number
const SHIPPING_FEE = 0;

function PaymentPage() {
  const [cart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });

  const [formError, setFormError] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const total = subtotal + SHIPPING_FEE;

  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formError) setFormError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
      setFormError("Your cart is empty. Add products before checking out.");
      return;
    }

    const { fullName, email, address, city, state } = customer;

    if (!fullName.trim() || !email.trim() || !address.trim() ||
        !city.trim() || !state.trim()) {
      setFormError("Please complete all the required delivery details.");
      return;
    }

    const orderItems = cart
      .map((item, index) => {
        const itemTotal = Number(item.price) * Number(item.quantity);

        return [
          `${index + 1}. ${item.title}`,
          item.selectedSize ? `   Size: ${item.selectedSize}` : null,
          `   Quantity: ${item.quantity}`,
          `   Unit price: $${Number(item.price).toFixed(2)}`,
          `   Subtotal: $${itemTotal.toFixed(2)}`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    const message = `
NEW ORDER - AVIT FASHION

CUSTOMER DETAILS
Name: ${fullName.trim()}
Email: ${email.trim()}
Address: ${address.trim()}
City: ${city.trim()}
State: ${state.trim()}

ORDER DETAILS
${orderItems}

PAYMENT SUMMARY
Subtotal: $${subtotal.toFixed(2)}
Shipping: To be confirmed
Order Total: $${total.toFixed(2)}

Please confirm this order.
    `.trim();

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Opens WhatsApp with the prepared order. The customer must press Send.
    window.location.href = whatsappURL;

  }

  if (cart.length === 0) {
    return (
      <main className="payment-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">🛍</div>
          <span className="payment-eyebrow">AVIT CHECKOUT</span>
          <h1>Your cart is empty</h1>
          <p>Add something you love to your cart before proceeding to checkout.</p>
          <a href="/" className="payment-return-btn">
            Continue Shopping <span>→</span>
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="payment-page">
      <div className="payment-container">
        <header className="payment-header">
          <span className="payment-eyebrow">THE FINAL STEP</span>
          <h1>Checkout</h1>
          <p>Complete your details and send your order directly to Avit.</p>
        </header>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="checkout-section">
              <div className="checkout-section-heading">
                <span className="section-number">01</span>
                <div>
                  <h2>Delivery Information</h2>
                  <p>Where should we deliver your order?</p>
                </div>
              </div>

              <div className="checkout-fields">
                <div className="checkout-field full-field">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={customer.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="checkout-field full-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={customer.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="checkout-field full-field">
                  <label htmlFor="address">Delivery Address</label>
                  <textarea
                    id="address"
                    name="address"
                    placeholder="House number, street name, area..."
                    value={customer.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    rows="3"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Your city"
                    value={customer.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="state">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Your state"
                    value={customer.state}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="checkout-section whatsapp-section">
              <div className="checkout-section-heading">
                <span className="section-number">02</span>
                <div>
                  <h2>Send Your Order</h2>
                  <p>Review your order and continue through WhatsApp.</p>
                </div>
              </div>

              <div className="whatsapp-notice">
                <div className="whatsapp-symbol">↗</div>
                <p>
                  Your order details will be arranged into a message and
                  opened in WhatsApp. You will be able to review it before
                  sending it to Avit.
                </p>
              </div>

              {formError && (
                <p className="checkout-error" role="alert">
                  {formError}
                </p>
              )}

              <button className="whatsapp-order-btn" type="submit">
                <span className="whatsapp-btn-icon">↗</span>
                Send Order via WhatsApp
              </button>

              <p className="checkout-privacy-note">
                No card details are collected on this page. Your order is
                submitted only when you press Send in WhatsApp.
              </p>
            </section>
          </form>

          <aside className="order-summary">
            <div className="order-summary-heading">
              <div>
                <span className="summary-eyebrow">YOUR SELECTION</span>
                <h2>Order Summary</h2>
              </div>
              <span className="item-count">{itemCount} items</span>
            </div>

            <div className="summary-products">
              {cart.map((item) => (
                <div className="summary-product" key={`${item.id}-${item.selectedSize || "one-size"}`}>
                  <div className="summary-product-image">
                    <img src={item.thumbnail} alt={item.title} />
                    <span className="summary-quantity">{item.quantity}</span>
                  </div>

                  <div className="summary-product-info">
                    <h3>{item.title}</h3>
                    {item.selectedSize && (
                      <span className="summary-size">
                        Size: {item.selectedSize}
                      </span>
                    )}
                    <span className="summary-unit-price">
                      ${Number(item.price).toFixed(2)} each
                    </span>
                  </div>

                  <strong className="summary-product-total">
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="summary-calculations">
              <div>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong className="shipping-pending">To be confirmed</strong>
              </div>
            </div>

            <div className="summary-grand-total">
              <span>Order Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <p className="summary-disclaimer">
              Shipping charges will be confirmed with you on WhatsApp before
              your order is finalized.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default PaymentPage;