"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Star,
  TrendingUp,
  Hammer,
  Shield,
  Lightbulb,
  Package2,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTelegram } from "../context/TelegramContext";
import { mockProducts } from "../data/mockData";

const Home = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { webApp } = useTelegram();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    typeof mockProducts
  >([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  // Refs for touch handling
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number>();
  const startX = useRef(0);
  const currentX = useRef(0);
  const startTime = useRef(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const handleAddToCart = (product: (typeof mockProducts)[0]) => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred("light");
    }

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

    if (webApp?.showAlert) {
      webApp.showAlert(`${product.name} added to cart!`);
    }
  };

  // Promotional banners for sponsors
  const promoOffers = [
    {
      id: 1,
      title: "25% OFF Steel Materials",
      subtitle: "Premium quality steel pipes & beams",
      sponsor: "SteelCorp Industries",
      discount: "25% OFF",
      bgColor: "from-red-500 to-red-600",
      validUntil: "Dec 31, 2024",
    },
    {
      id: 2,
      title: "Buy 2 Get 1 FREE",
      subtitle: "Safety equipment & protective gear",
      sponsor: "SafetyFirst Co.",
      discount: "BOGO",
      bgColor: "from-green-500 to-green-600",
      validUntil: "Jan 15, 2025",
    },
    {
      id: 3,
      title: "Free Shipping",
      subtitle: "On orders over $200",
      sponsor: "QuickShip Logistics",
      discount: "FREE SHIP",
      bgColor: "from-purple-500 to-purple-600",
      validUntil: "Ongoing",
    },
  ];

  const categories = [
    {
      id: "materials",
      name: "Materials",
      icon: Package2,
      count: 45,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      id: "safety",
      name: "Safety",
      icon: Shield,
      count: 23,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      id: "tools",
      name: "Tools",
      icon: Hammer,
      count: 67,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      id: "lighting",
      name: "Lighting",
      icon: Lightbulb,
      count: 34,
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
  ];

  const suggestions = mockProducts.slice(0, 4);
  const popularItems = mockProducts.slice(2, 6);

  // Recent order products
  const recentOrderProducts = [
    {
      ...mockProducts[0],
      orderedDate: "2 days ago",
      status: "delivered",
      statusIcon: CheckCircle,
      statusColor: "text-green-600",
      statusBg: "bg-green-50",
    },
    {
      ...mockProducts[1],
      orderedDate: "5 days ago",
      status: "processing",
      statusIcon: Clock,
      statusColor: "text-orange-600",
      statusBg: "bg-orange-50",
    },
  ];

  // Simplified slide navigation
  const goToSlide = useCallback(
    (index: number, animate = true) => {
      if (index < 0 || index >= promoOffers.length) return;

      setCurrentPromoIndex(index);
      const newTranslateX = -index * 100;

      if (animate) {
        setTranslateX(newTranslateX);
      } else {
        setTranslateX(newTranslateX);
      }
    },
    [promoOffers.length]
  );

  const nextPromo = useCallback(() => {
    const nextIndex = (currentPromoIndex + 1) % promoOffers.length;
    goToSlide(nextIndex);
  }, [currentPromoIndex, promoOffers.length, goToSlide]);

  const prevPromo = useCallback(() => {
    const prevIndex =
      (currentPromoIndex - 1 + promoOffers.length) % promoOffers.length;
    goToSlide(prevIndex);
  }, [currentPromoIndex, promoOffers.length, goToSlide]);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = window.setInterval(() => {
      if (!isDragging && !isHovered) {
        nextPromo();
      }
    }, 4000);
  }, [isDragging, isHovered, nextPromo]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = undefined;
    }
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (promoOffers.length <= 1) return;

      setIsDragging(true);
      stopAutoPlay();

      const touch = e.touches[0];
      startX.current = touch.clientX;
      currentX.current = touch.clientX;
      startTime.current = Date.now();

      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred("light");
      }
    },
    [promoOffers.length, stopAutoPlay, webApp]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || promoOffers.length <= 1) return;

      const touch = e.touches[0];
      currentX.current = touch.clientX;
      const deltaX = currentX.current - startX.current;
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const movePercent = (deltaX / containerWidth) * 100;

      // Apply the movement with current slide offset
      const newTranslateX = -currentPromoIndex * 100 + movePercent;
      setTranslateX(newTranslateX);
    },
    [isDragging, currentPromoIndex, promoOffers.length]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || promoOffers.length <= 1) return;

    setIsDragging(false);

    const deltaX = currentX.current - startX.current;
    const deltaTime = Date.now() - startTime.current;
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const velocity = Math.abs(deltaX) / deltaTime;

    // Determine if it's a swipe (fast movement) or drag (slow movement)
    const isSwipe = velocity > 0.5 || Math.abs(deltaX) > containerWidth * 0.25;

    let newIndex = currentPromoIndex;

    if (isSwipe) {
      if (deltaX > 0 && currentPromoIndex > 0) {
        newIndex = currentPromoIndex - 1;
      } else if (deltaX < 0 && currentPromoIndex < promoOffers.length - 1) {
        newIndex = currentPromoIndex + 1;
      }
    }

    // Snap to the determined slide
    goToSlide(newIndex);

    // Restart auto-play after a delay
    setTimeout(() => {
      if (!isHovered) {
        startAutoPlay();
      }
    }, 1000);
  }, [
    isDragging,
    currentPromoIndex,
    promoOffers.length,
    goToSlide,
    isHovered,
    startAutoPlay,
  ]);

  // Mouse event handlers for desktop
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (promoOffers.length <= 1) return;

      setIsDragging(true);
      stopAutoPlay();

      startX.current = e.clientX;
      currentX.current = e.clientX;
      startTime.current = Date.now();
    },
    [promoOffers.length, stopAutoPlay]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || promoOffers.length <= 1) return;

      currentX.current = e.clientX;
      const deltaX = currentX.current - startX.current;
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const movePercent = (deltaX / containerWidth) * 100;

      const newTranslateX = -currentPromoIndex * 100 + movePercent;
      setTranslateX(newTranslateX);
    },
    [isDragging, currentPromoIndex, promoOffers.length]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging || promoOffers.length <= 1) return;

    setIsDragging(false);

    const deltaX = currentX.current - startX.current;
    const containerWidth = containerRef.current?.offsetWidth || 0;

    let newIndex = currentPromoIndex;

    if (Math.abs(deltaX) > containerWidth * 0.25) {
      if (deltaX > 0 && currentPromoIndex > 0) {
        newIndex = currentPromoIndex - 1;
      } else if (deltaX < 0 && currentPromoIndex < promoOffers.length - 1) {
        newIndex = currentPromoIndex + 1;
      }
    }

    goToSlide(newIndex);

    setTimeout(() => {
      if (!isHovered) {
        startAutoPlay();
      }
    }, 1000);
  }, [
    isDragging,
    currentPromoIndex,
    promoOffers.length,
    goToSlide,
    isHovered,
    startAutoPlay,
  ]);

  // Initialize
  useEffect(() => {
    goToSlide(0, false);
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  // Handle hover states
  useEffect(() => {
    if (!isHovered && !isDragging) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }, [isHovered, isDragging, startAutoPlay, stopAutoPlay]);

  // Arrow visibility
  useEffect(() => {
    let timer: number;

    const handleInteractionStart = () => {
      setShowArrows(true);
      setIsHovered(true);
      if (timer) clearTimeout(timer);
    };

    const handleInteractionEnd = () => {
      timer = window.setTimeout(() => {
        setShowArrows(false);
        setIsHovered(false);
      }, 2000);
    };

    const banner = containerRef.current;
    if (banner) {
      banner.addEventListener("mouseenter", handleInteractionStart);
      banner.addEventListener("mouseleave", handleInteractionEnd);
      banner.addEventListener("touchstart", handleInteractionStart, {
        passive: true,
      });
      banner.addEventListener("touchend", handleInteractionEnd, {
        passive: true,
      });

      return () => {
        banner.removeEventListener("mouseenter", handleInteractionStart);
        banner.removeEventListener("mouseleave", handleInteractionEnd);
        banner.removeEventListener("touchstart", handleInteractionStart);
        banner.removeEventListener("touchend", handleInteractionEnd);
        if (timer) clearTimeout(timer);
      };
    }
  }, []);

  // Filter products for search suggestions
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = mockProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm]);

  const handleSuggestionClick = (product: (typeof mockProducts)[0]) => {
    setSearchTerm(product.name);
    setIsSearchFocused(false);
    setSearchSuggestions([]);
    navigate(`/products?search=${encodeURIComponent(product.name)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-100 min-h-screen"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Simplified Promotional Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative rounded-2xl overflow-hidden"
          ref={containerRef}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${translateX}%)`,
                transitionDuration: isDragging ? "0ms" : "300ms",
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {promoOffers.map((promo, index) => (
                <div
                  key={promo.id}
                  className={`relative bg-gradient-to-r ${promo.bgColor} p-6 text-white w-full flex-shrink-0 min-h-[160px] select-none cursor-grab active:cursor-grabbing`}
                  style={{ opacity: index === currentPromoIndex ? 1 : 0.9 }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {promo.discount}
                      </span>
                    </div>
                    <h1 className="text-xl font-bold mb-1">{promo.title}</h1>
                    <p className="text-white text-opacity-90 mb-3 text-sm">
                      {promo.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white text-opacity-75">
                          Sponsored by
                        </p>
                        <p className="text-sm font-medium">{promo.sponsor}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/products")}
                        className="bg-white text-gray-900 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-100 transition-all duration-200 shadow-lg"
                      >
                        Shop Now
                      </motion.button>
                    </div>
                    <p className="text-xs text-white text-opacity-60 mt-2">
                      Valid until {promo.validUntil}
                    </p>
                  </div>

                  {/* Simple background elements */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white bg-opacity-10 rounded-full" />
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white bg-opacity-5 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <AnimatePresence>
            {showArrows && promoOffers.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevPromo}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-20"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextPromo}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-20"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Dots Indicator */}
          {promoOffers.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {promoOffers.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => goToSlide(index)}
                  className="relative"
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-200 ${
                      index === currentPromoIndex
                        ? "bg-white w-8 shadow-lg"
                        : "bg-white bg-opacity-60 w-2"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Enhanced Search Bar with Live Suggestions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="What do you need today?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchSuggestions([]);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              )}
            </form>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg z-50 overflow-hidden"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      Products ({searchSuggestions.length})
                    </div>
                    {searchSuggestions.map((product, index) => (
                      <motion.button
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(product)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {product.code}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 capitalize">
                              {product.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-600 font-semibold text-sm">
                            ${product.price}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.stock} in stock
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {searchTerm && searchSuggestions.length > 0 && (
                    <div className="border-t border-gray-100 px-4 py-3">
                      <button
                        onClick={handleSearch}
                        className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
                      >
                        <Search className="w-4 h-4" />
                        Search for "{searchTerm}"
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* No results message */}
            <AnimatePresence>
              {isSearchFocused &&
                searchTerm.trim().length > 0 &&
                searchSuggestions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-lg z-50 overflow-hidden"
                  >
                    <div className="px-4 py-6 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm mb-3">
                        No products found for "{searchTerm}"
                      </p>
                      <button
                        onClick={handleSearch}
                        className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
                      >
                        Search anyway
                      </button>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Modern Horizontal Categories */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Shop by Category
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal Scrollable Categories */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/products?category=${category.id}`)}
                  className="flex-shrink-0 relative group"
                >
                  {/* Main Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 min-w-[140px]">
                    {/* Gradient Icon Background */}
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    {/* Category Info */}
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-gray-700 transition-colors">
                        {category.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={`text-xs font-semibold ${category.textColor}`}
                        >
                          {category.count}
                        </span>
                        <span className="text-xs text-gray-500">items</span>
                      </div>
                    </div>

                    {/* Subtle Hover Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                    ></div>
                  </div>

                  {/* Active Indicator */}
                  <div
                    className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${category.gradient} rounded-full group-hover:w-8 transition-all duration-300`}
                  ></div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Order Products */}
        {recentOrderProducts.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recently Ordered
              </h2>
              <button
                onClick={() => navigate("/orders")}
                className="text-blue-600 text-sm font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recentOrderProducts.map((product, index) => {
                const StatusIcon = product.statusIcon;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        Ordered {product.orderedDate}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-semibold text-sm">
                          ${product.price}
                        </span>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full ${product.statusBg}`}
                        >
                          <StatusIcon
                            className={`w-3 h-3 ${product.statusColor}`}
                          />
                          <span
                            className={`text-xs font-medium capitalize ${product.statusColor}`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                    >
                      Reorder
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Smart Suggestions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              You Might Need
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="text-blue-600 text-sm font-medium flex items-center gap-1"
            >
              See More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex-shrink-0 w-40 bg-white rounded-2xl p-3 shadow-sm"
              >
                <div className="w-full h-24 bg-gray-100 rounded-xl mb-3 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
                <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold text-sm">
                    ${product.price}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddToCart(product)}
                    className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs">+</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section - Popular This Week */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Popular This Week
            </h2>
          </div>
          <div className="space-y-3">
            {popularItems.slice(0, 3).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-white rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`star-${i}`}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-semibold">
                      ${product.price}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
