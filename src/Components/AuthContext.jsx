
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider
export function AuthProvider({ children }) {

  // ---------------- USER STATE ----------------

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("petilio_user");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error loading user:", error);
      localStorage.removeItem("petilio_user");
      return null;
    }
  });

  // ---------------- CART STATE ----------------

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("petilio_cart");

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      localStorage.removeItem("petilio_cart");
      return [];
    }
  });

  // Save cart whenever cart changes
  useEffect(() => {
    localStorage.setItem("petilio_cart", JSON.stringify(cart));
  }, [cart]);

  // ---------------- LOGIN ----------------

  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "petilio_user",
      JSON.stringify(userData)
    );
  };

  // ---------------- LOGOUT ----------------

  const logout = () => {
    setUser(null);

    localStorage.removeItem("petilio_user");

    // Cart is preserved when user logs out.
  };

  // ---------------- ADD TO CART ----------------

  const addToCart = (product) => {
    const quantity = Math.max(
      1,
      Number(product.quantity) || 1
    );

    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id &&
          item.size === product.size
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  // ---------------- UPDATE QUANTITY ----------------

  const updateCartQuantity = (productId, size, quantity) => {
    const newQuantity = Number(quantity);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
      return;
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId && item.size === size
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  };

  // ---------------- REMOVE FROM CART ----------------

  const removeFromCart = (productId, size) => {
    setCart((previousCart) =>
      previousCart.filter((item) => {
        if (size === undefined) {
          return item.id !== productId;
        }

        return !(
          item.id === productId &&
          item.size === size
        );
      })
    );
  };

  // ---------------- CLEAR CART ----------------

  const clearCart = () => {
    setCart([]);
  };

  // ---------------- CART COUNT ----------------

  const cartCount = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  // ---------------- CART TOTAL ----------------

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        (Number(item.quantity) || 0),
    0
  );

  // ---------------- CONTEXT VALUE ----------------

  const contextValue = {
    // User
    user,
    login,
    logout,

    // Cart
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,

    // Calculations
    cartCount,
    cartTotal,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------- CUSTOM HOOK ----------------

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider. Wrap your App with AuthProvider in main.jsx."
    );
  }

  return context;
}
