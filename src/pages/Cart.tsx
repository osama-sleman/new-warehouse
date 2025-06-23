"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTelegram } from "../context/TelegramContext";
import ShippingSelector from "../components/ShippingSelector";
import PaymentSelector from "../components/PaymentSelector";
import { NotificationService } from "../services/notificationService";

const Cart = () => {
  const { state, dispatch } = useCart();
  const { user: authUser } = useAuth();
  const { webApp, user: telegramUser } = useTelegram();

  const updateQuantity = (id: string, quantity: number) => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred("light");
    }
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred("medium");
    }
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const handleCheckout = async () => {
    if (state.items.length === 0 || !state.shipping || !state.paymentMethod)
      return;

    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred("heavy");
    }

    // Generate order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    const totalWithShipping = state.total + state.shippingCost;

    // Use test user data if no real user
    const customerName =
      authUser?.first_name || telegramUser?.first_name || "Test User";

    // Send order confirmation notification
    await NotificationService.sendOrderNotification({
      orderId,
      type: "confirmation",
      customerName,
      items: state.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalWithShipping,
      deliveryAddress: state.shipping.city,
      paymentMethod: state.paymentMethod as "cash" | "syriatel",
    });

    // Send order data to backend (if available)
    if (webApp?.sendData) {
      webApp.sendData(
        JSON.stringify({
          type: "order",
          orderId,
          items: state.items,
          shipping: state.shipping,
          paymentMethod: state.paymentMethod,
          subtotal: state.total,
          shippingCost: state.shippingCost,
          total: totalWithShipping,
          timestamp: new Date().toISOString(),
          customerInfo: {
            name: customerName,
            username:
              authUser?.username || telegramUser?.username || "testuser",
            userId: authUser?.id || telegramUser?.id || 12345,
          },
        })
      );
    }

    // Show success message
    if (webApp?.showAlert) {
      const successMessage =
        state.paymentMethod === "cash"
          ? `✅ Order confirmed! You'll receive delivery details via Telegram. Please have $${totalWithShipping.toFixed(
              2
            )} ready for cash payment.`
          : `✅ Order confirmed! Please complete payment via Syriatel Cash. Check Telegram for payment instructions.`;

      webApp.showAlert(successMessage);
    }

    // Clear cart
    dispatch({ type: "CLEAR_CART" });
  };

  // Calculate totals
  const totalWithShipping = state.total + state.shippingCost;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-100 min-h-screen"
    >
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart
            {state.itemCount > 0 && (
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({state.itemCount} items)
              </span>
            )}
          </h1>
        </div>

        {state.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">Add some items to get started!</p>
            <motion.a
              href="/"
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Start Shopping
            </motion.a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              <AnimatePresence>
                {state.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {item.category}
                      </p>
                      <p className="text-blue-500 font-medium">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-md bg-white flex items-center justify-center disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-md bg-white flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              {/* Shipping Selector */}
              <ShippingSelector />

              {/* Payment Selector - Only show after shipping is selected */}
              {state.shipping && <PaymentSelector />}

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({state.itemCount})</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {state.shipping ? (
                    state.shippingCost === 0 ? (
                      <span className="text-green-500 font-medium">FREE</span>
                    ) : (
                      <span>${state.shippingCost.toFixed(2)}</span>
                    )
                  ) : (
                    <span className="text-gray-400">Select shipping</span>
                  )}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${totalWithShipping.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                disabled={
                  state.items.length === 0 ||
                  !state.shipping ||
                  !state.paymentMethod
                }
                className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!state.shipping
                  ? "Select Shipping to Continue"
                  : !state.paymentMethod
                  ? "Select Payment Method"
                  : state.paymentMethod === "cash"
                  ? "Confirm Order (Cash on Delivery)"
                  : "Confirm Order & Pay"}
              </motion.button>

              {state.shipping && !state.paymentMethod && (
                <p className="text-center text-sm text-red-500 mt-2">
                  Please select a payment method
                </p>
              )}

              {state.paymentMethod === "cash" && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  💰 You'll pay ${totalWithShipping.toFixed(2)} when your order
                  is delivered
                </p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;
