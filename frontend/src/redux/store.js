import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import shoppingReducer from "./slice/shoppingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shopping: shoppingReducer,
  },
});

let previousCartItems = store.getState().shopping.cartItems;
let previousFavorites = store.getState().shopping.favoriteServices;

store.subscribe(() => {
  const { cartItems, favoriteServices } = store.getState().shopping;

  if (cartItems !== previousCartItems) {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Unable to save cart to local storage", error);
    }
    previousCartItems = cartItems;
  }

  if (favoriteServices !== previousFavorites) {
    try {
      localStorage.setItem(
        "favoriteServices",
        JSON.stringify(favoriteServices),
      );
    } catch (error) {
      console.error("Unable to save favorites to local storage", error);
    }
    previousFavorites = favoriteServices;
  }
});
