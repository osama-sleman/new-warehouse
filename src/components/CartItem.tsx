"use client";

import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useTelegram } from "../context/TelegramContext";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
  };
  index: number;
}

const CartItem = ({ item, index }: CartItemProps) => {
  const { dispatch } = useCart();
  const { webApp } = useTelegram();

  const updateQuantity = (newQuantity: number) => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred("light");
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: item.id, quantity: newQuantity },
    });
  };

  const removeItem = () => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred("medium");
    }

    dispatch({
      type: "REMOVE_ITEM",
      payload: item.id,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ delay: index * 0.1 }}
      className="cart-item"
    >
      <div className="item-image">
        <img src={item.image || "/placeholder.svg"} alt={item.name} />
      </div>

      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-category">{item.category}</p>
        <p className="item-price">${item.price.toFixed(2)} each</p>
      </div>

      <div className="item-controls">
        <div className="quantity-controls">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => updateQuantity(item.quantity - 1)}
            className="quantity-btn"
            data-action="decrease"
            disabled={item.quantity <= 1}
          ></motion.button>

          <span className="quantity">{item.quantity}</span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => updateQuantity(item.quantity + 1)}
            className="quantity-btn"
            data-action="increase"
          ></motion.button>
        </div>

        <div className="item-total">
          ${(item.price * item.quantity).toFixed(2)}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={removeItem}
          className="remove-btn"
        ></motion.button>
      </div>
    </motion.div>
  );
};

export default CartItem;
