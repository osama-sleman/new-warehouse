"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Plus, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTelegram } from "../context/TelegramContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  code: string;
  description: string;
  rating: number;
  images: string[]; // Make this required instead of optional
}

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
  const { dispatch } = useCart();
  const { webApp } = useTelegram();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const animationFrameRef = useRef<number>();

  // Use product.images directly since it's now required
  const images = product.images.length > 0 ? product.images : [product.image];

  // Check if Telegram WebApp supports BackButton
  const isBackButtonSupported = () => {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) return false;

    try {
      const tg = window.Telegram.WebApp as any;
      // Check if BackButton exists and version is 6.1 or higher
      const version = tg.version ?? "6.0";
      const versionNumber = Number.parseFloat(version);
      return tg.BackButton && versionNumber >= 6.1;
    } catch (error) {
      console.warn("Failed to check BackButton support:", error);
      return false;
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Disable body scroll
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = "0";

    return () => {
      // Re-enable body scroll
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, []);

  // Handle swipe-to-close functionality
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isDragging = false;

    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      startX = touchEvent.touches[0].clientX;
      startY = touchEvent.touches[0].clientY;
      startTime = Date.now();
      isDragging = false;

      // Always prevent default to stop background interaction
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchMove = (e: Event) => {
      const touchEvent = e as TouchEvent;
      const currentX = touchEvent.touches[0].clientX;
      const currentY = touchEvent.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      isDragging = true;

      // Always prevent default and stop propagation to prevent background scrolling
      e.preventDefault();
      e.stopPropagation();

      // Optimize visual feedback with requestAnimationFrame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Only apply visual feedback for downward swipes to reduce lag
      if (diffY > 20 && Math.abs(diffY) > Math.abs(diffX)) {
        animationFrameRef.current = requestAnimationFrame(() => {
          const modalElement = document.querySelector(
            ".product-detail-modal"
          ) as HTMLElement;
          if (modalElement) {
            const progress = Math.min(diffY / 200, 0.5); // Limit progress to 0.5
            modalElement.style.transform = `translateY(${diffY * 0.3}px)`; // Reduced multiplier
            modalElement.style.opacity = (1 - progress * 0.2).toString(); // Reduced opacity change
          }
        });
      }
    };

    const handleTouchEnd = (e: Event) => {
      const touchEvent = e as TouchEvent;
      const endX = touchEvent.changedTouches[0].clientX;
      const endY = touchEvent.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;
      const timeDiff = Date.now() - startTime;

      // Always prevent default and stop propagation
      e.preventDefault();
      e.stopPropagation();

      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Reset modal visual state smoothly
      const modalElement = document.querySelector(
        ".product-detail-modal"
      ) as HTMLElement;
      if (modalElement) {
        modalElement.style.transition =
          "transform 0.2s ease-out, opacity 0.2s ease-out";
        modalElement.style.opacity = "";
        modalElement.style.transform = "";

        // Remove transition after animation
        setTimeout(() => {
          modalElement.style.transition = "";
        }, 200);
      }

      // Check for swipe gestures that should close the modal
      const isQuickSwipe = timeDiff < 300;
      const isDownwardSwipe = diffY > 80 && Math.abs(diffY) > Math.abs(diffX); // Reduced threshold
      const isRightSwipe = diffX > 100 && Math.abs(diffX) > Math.abs(diffY);

      if (isDragging && (isDownwardSwipe || (isQuickSwipe && isRightSwipe))) {
        onClose();
      }
    };

    // Prevent all touch events from reaching background
    const preventBackgroundTouch = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Add event listeners to the modal element and backdrop
    const modalElement = document.querySelector(".product-detail-modal");
    const backdropElement = document.querySelector(".modal-backdrop");

    if (modalElement) {
      modalElement.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      modalElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      modalElement.addEventListener("touchend", handleTouchEnd, {
        passive: false,
      });
    }

    if (backdropElement) {
      backdropElement.addEventListener("touchstart", preventBackgroundTouch, {
        passive: false,
      });
      backdropElement.addEventListener("touchmove", preventBackgroundTouch, {
        passive: false,
      });
      backdropElement.addEventListener("touchend", preventBackgroundTouch, {
        passive: false,
      });
    }

    // Handle browser back button - prevent navigation, just close modal
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Push the current state back to prevent navigation
      window.history.pushState(null, "", window.location.href);
      onClose();
    };

    // Add a history entry when modal opens
    window.history.pushState(
      { modal: "product-detail" },
      "",
      window.location.href
    );
    window.addEventListener("popstate", handlePopState);

    // Handle Telegram back button only if supported
    let telegramBackButtonCleanup: (() => void) | undefined;

    if (isBackButtonSupported()) {
      try {
        const tg = window.Telegram?.WebApp as any;
        if (tg) {
          const handleBackButton = () => {
            // Prevent default navigation behavior
            if (window.history.length > 1) {
              window.history.pushState(null, "", window.location.href);
            }
            onClose();
          };

          // Show back button and set handler
          tg.BackButton.show();
          tg.BackButton.onClick(handleBackButton);

          telegramBackButtonCleanup = () => {
            try {
              if (tg.BackButton?.offClick) {
                tg.BackButton.offClick(handleBackButton);
              }
              // Don't hide the back button, let the parent component handle it
            } catch (cleanupError) {
              console.warn("BackButton cleanup failed:", cleanupError);
            }
          };
        }
      } catch (error) {
        console.warn("BackButton setup failed:", error);
      }
    } else {
      console.log("BackButton not supported in this Telegram version");
    }

    return () => {
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (modalElement) {
        modalElement.removeEventListener("touchstart", handleTouchStart);
        modalElement.removeEventListener("touchmove", handleTouchMove);
        modalElement.removeEventListener("touchend", handleTouchEnd);
      }
      if (backdropElement) {
        backdropElement.removeEventListener(
          "touchstart",
          preventBackgroundTouch
        );
        backdropElement.removeEventListener(
          "touchmove",
          preventBackgroundTouch
        );
        backdropElement.removeEventListener("touchend", preventBackgroundTouch);
      }

      window.removeEventListener("popstate", handlePopState);

      // Clean up Telegram back button if it was set up
      if (telegramBackButtonCleanup) {
        telegramBackButtonCleanup();
      }

      // Remove the history entry we added only if history is available
      if (typeof window !== "undefined" && window.history.length > 1) {
        window.history.back();
      }
    };
  }, [onClose]);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
    });
    webApp?.HapticFeedback?.notificationOccurred("success");

    // Close modal after adding to cart
    setTimeout(() => {
      onClose();
    }, 300); // Small delay for haptic feedback
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getStockColor = (stock: number) => {
    if (stock > 50) return "bg-green-100 text-green-800";
    if (stock > 20) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 z-50"
        style={{ touchAction: "none" }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="product-detail-modal fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-auto prevent-swipe-back"
        style={{ touchAction: "none" }}
      >
        {/* Swipe indicator */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Image gallery */}
        <div className="relative h-72 bg-gray-100 prevent-swipe-back">
          <img
            src={
              images[currentImageIndex] ??
              "/placeholder.svg?height=300&width=400"
            }
            alt={product.name}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Image navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((image, index) => (
                  <button
                    key={`${product.id}-image-${index}-${image}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex
                        ? "bg-blue-500"
                        : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Stock badge */}
          <span
            className={`absolute top-4 left-4 text-xs px-2 py-1 rounded-full font-medium ${getStockColor(
              product.stock
            )}`}
          >
            {product.stock} in stock
          </span>
        </div>

        {/* Product details */}
        <div className="p-5">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={`${product.id}-star-${i}`}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Code: {product.code}</span>
              <span>•</span>
              <span className="capitalize">{product.category}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Add to Cart
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductDetailModal;
