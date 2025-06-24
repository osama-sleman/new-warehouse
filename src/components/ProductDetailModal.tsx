"use client";

import { useState } from "react";
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

  // Use product.images directly since it's now required
  const images = product.images.length > 0 ? product.images : [product.image];

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
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-auto prevent-swipe-back"
      >
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
              images[currentImageIndex] ||
              "/placeholder.svg?height=300&width=400"
            }
            alt={product.name}
            className="w-full h-full object-cover"
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
                {images.map((_, index) => (
                  <button
                    key={index}
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
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
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
