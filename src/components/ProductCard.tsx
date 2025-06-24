"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Plus, Package } from "lucide-react";
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
  images: string[];
}

interface ProductCardProps {
  product: Product;
  index: number;
  onProductClick: (product: Product) => void;
}

export function ProductCard({
  product,
  index,
  onProductClick,
}: ProductCardProps) {
  const { dispatch } = useCart();
  const { webApp } = useTelegram();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal when clicking the add button

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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onProductClick(product)}
      className="overflow-hidden bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-200 rounded-xl cursor-pointer"
    >
      <div className="p-0">
        <div className="relative">
          <img
            src={product.image || "/placeholder.svg?height=160&width=200"}
            alt={product.name}
            className="w-full h-40 object-cover bg-gray-200"
          />
        </div>

        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Package className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{product.code}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-blue-600">
              ${product.price}
            </div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 p-0 flex items-center justify-center transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
