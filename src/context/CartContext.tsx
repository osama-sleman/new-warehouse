"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";
import type { ShippingOption } from "../data/shippingData";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  shipping: ShippingOption | null;
  shippingCost: number;
  paymentMethod: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_SHIPPING"; payload: ShippingOption }
  | { type: "SET_PAYMENT_METHOD"; payload: string }
  | { type: "CLEAR_CART" };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setShipping: (option: ShippingOption) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      return {
        ...state,
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "SET_SHIPPING": {
      return {
        ...state,
        shipping: action.payload,
        shippingCost: action.payload.cost,
      };
    }

    case "SET_PAYMENT_METHOD": {
      return {
        ...state,
        paymentMethod: action.payload,
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
        shipping: null,
        shippingCost: 0,
        paymentMethod: null,
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    shipping: null,
    shippingCost: 0,
    paymentMethod: null,
  });

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      addItem: (item: Omit<CartItem, "quantity">) =>
        dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (id: string) =>
        dispatch({ type: "REMOVE_ITEM", payload: id }),
      updateQuantity: (id: string, quantity: number) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
      setShipping: (option: ShippingOption) =>
        dispatch({ type: "SET_SHIPPING", payload: option }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    }),
    [state]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
