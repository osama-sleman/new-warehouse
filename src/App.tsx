"use client";

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
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

// Navigation handler component
function NavigationHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle navigation with Telegram WebApp if available
    const handleTelegramNavigation = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp as any; // Use any to bypass type checking

        // Try to use BackButton if it exists
        try {
          if (tg.BackButton) {
            const handleBack = () => {
              if (location.pathname === "/" || location.pathname === "/home") {
                return;
              } else {
                navigate(-1);
              }
            };

            tg.BackButton.onClick(handleBack);

            if (location.pathname === "/" || location.pathname === "/home") {
              tg.BackButton.hide();
            } else {
              tg.BackButton.show();
            }

            return () => {
              try {
                if (tg.BackButton?.offClick) {
                  tg.BackButton.offClick(handleBack);
                }
              } catch (e) {
                console.log("BackButton cleanup failed:", e);
              }
            };
          }
        } catch (e) {
          console.log("BackButton not available:", e);
        }
      }
    };

    return handleTelegramNavigation();
  }, [location, navigate]);

  return null;
}

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

    // Prevent swipe-to-go-back from closing the app
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // If it's a horizontal swipe from the left edge
        if (
          startX < 20 && // Started from left edge
          Math.abs(diffX) > Math.abs(diffY) && // More horizontal than vertical
          diffX > 50 // Swiping right
        ) {
          e.preventDefault();
          e.stopPropagation();

          // Navigate back manually if possible
          if (window.history.length > 1) {
            window.history.back();
          }
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <TelegramProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col prevent-swipe-back">
              <NavigationHandler />
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
