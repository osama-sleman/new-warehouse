"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import FilterPanel from "../components/FilterPanel";
import ProductDetailModal from "../components/ProductDetailModal";
import LoginPrompt from "../components/LoginPrompt";
import { mockProducts } from "../data/mockData";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") ?? "all"
  );
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof mockProducts)[0] | null
  >(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [selectedCategory, priceRange, searchTerm]);

  const handleProductClick = (product: (typeof mockProducts)[0]) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-gray-100 min-h-screen"
      >
        <div className="px-4 py-4">
          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-white rounded-xl border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowFilterPanel(true)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="text-gray-400 w-5 h-5" />
              {(selectedCategory !== "all" ||
                priceRange[0] !== 0 ||
                priceRange[1] !== 1000) && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Results count */}
          <div className="mt-4 mb-2 text-sm text-gray-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onProductClick={handleProductClick}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 text-lg mb-2">
                No products found
              </div>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilterPanel && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilterPanel(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
              />

              {/* Filter Panel */}
              <FilterPanel
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onClose={() => setShowFilterPanel(false)}
              />
            </>
          )}
        </AnimatePresence>

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <LoginPrompt
            title="Sign In to Add Items"
            message="Connect your Telegram account to add items to cart and place orders"
            onClose={() => setShowLoginPrompt(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Products;
