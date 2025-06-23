"use client";

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Home from "./pages/Home";
import BottomNav from "./components/BottomNav";
import LoadingScreen from "./components/LoadingScreen";
import { CartProvider } from "./context/CartContext";
import { TelegramProvider } from "./context/TelegramContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
    }

    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <TelegramProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col">
              <Header />
              <main className="flex-1 pb-20">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/orders" element={<Orders />} />
                  </Routes>
                </AnimatePresence>
              </main>
              <BottomNav />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </TelegramProvider>
  );
}

export default App;
