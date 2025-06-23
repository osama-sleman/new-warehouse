"use client";

import { motion } from "framer-motion";
import { Smartphone, ShoppingCart, Bell, Shield, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTelegram } from "../context/TelegramContext";

interface LoginPromptProps {
  onClose?: () => void;
  title?: string;
  message?: string;
}

const LoginPrompt = ({
  onClose,
  title = "Connect Your Account",
  message = "Sign in with Telegram to place orders and access all features",
}: LoginPromptProps) => {
  const { login, isLoading } = useAuth();
  const { user: telegramUser } = useTelegram();

  const handleLogin = async () => {
    try {
      await login();
      onClose?.();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const benefits = [
    {
      icon: ShoppingCart,
      title: "Place Orders",
      description: "Add items to cart and checkout securely",
    },
    {
      icon: Bell,
      title: "Order Updates",
      description: "Get real-time notifications about your orders",
    },
    {
      icon: Shield,
      title: "Secure Account",
      description: "Your data is protected with Telegram security",
    },
    {
      icon: Zap,
      title: "Quick Checkout",
      description: "Fast and seamless ordering experience",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{message}</p>
          </div>

          {/* User Info */}
          {telegramUser && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {telegramUser.first_name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {telegramUser.first_name} {telegramUser.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    @{telegramUser.username || "telegram_user"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              What you'll get:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-4"
                  >
                    <Icon className="w-6 h-6 text-blue-500 mb-2" />
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoading || !telegramUser}
              className="w-full flex items-center justify-center gap-3 p-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5" />
                  <span>Connect with Telegram</span>
                </>
              )}
            </motion.button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-full p-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Maybe later
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default LoginPrompt;
