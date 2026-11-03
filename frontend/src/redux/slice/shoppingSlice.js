import { createSlice } from "@reduxjs/toolkit";

const readItems = (key) => {
  try {
    const items = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error(`Unable to read ${key} from local storage`, error);
    return [];
  }
};

const initialState = {
  cartItems: readItems("cartItems"),
  favoriteServices: readItems("favoriteServices"),
};

export const getCartItemType = (item) =>
  item?.itemType === "product" ? "product" : "service";

const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const service = action.payload;
      if (
        !service?._id ||
        state.cartItems.some(
          (item) =>
            item._id === service._id && getCartItemType(item) === "service",
        )
      ) {
        return;
      }

      state.cartItems.push({ ...service, itemType: "service", quantity: 1 });
    },
    addProductToCart: (state, action) => {
      const product = action.payload;
      if (!product?._id || product.isActive === false || product.stock < 1) {
        return;
      }

      const existing = state.cartItems.find(
        (item) =>
          item._id === product._id && getCartItemType(item) === "product",
      );
      if (existing) {
        existing.quantity = Math.min(
          (existing.quantity || 1) + 1,
          product.stock,
        );
        existing.stock = product.stock;
        return;
      }
      state.cartItems.push({
        ...product,
        itemType: "product",
        quantity: 1,
      });
    },
    removeFromCart: (state, action) => {
      const { id, itemType } =
        typeof action.payload === "object"
          ? action.payload
          : { id: action.payload, itemType: undefined };
      state.cartItems = state.cartItems.filter(
        (item) =>
          item._id !== id ||
          (itemType && getCartItemType(item) !== itemType),
      );
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload || {};
      if (!Number.isInteger(quantity) || quantity < 1) return;
      const product = state.cartItems.find(
        (item) =>
          item._id === id && getCartItemType(item) === "product",
      );
      if (product) {
        product.quantity = Math.min(quantity, Number(product.stock) || quantity);
      }
    },
    clearCart: (state, action) => {
      if (!action.payload) {
        state.cartItems = [];
      } else {
        state.cartItems = state.cartItems.filter(
          (item) => getCartItemType(item) !== action.payload,
        );
      }
    },
    toggleFavorite: (state, action) => {
      const service = action.payload;
      if (!service?._id) return;

      const isFavorite = state.favoriteServices.some(
        (item) => item._id === service._id,
      );
      state.favoriteServices = isFavorite
        ? state.favoriteServices.filter((item) => item._id !== service._id)
        : [...state.favoriteServices, service];
    },
  },
});

export const {
  addToCart,
  addProductToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  toggleFavorite,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
