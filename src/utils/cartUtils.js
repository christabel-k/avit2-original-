export function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

export function getCartCount() {
  const cart = getCart();

  return cart.reduce((total, item) => {
    return total + (Number(item.quantity) || 1);
  }, 0);
}

export function notifyCartUpdated() {
  window.dispatchEvent(new Event("cartUpdated"));
}