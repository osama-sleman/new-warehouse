"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

interface FilterPanelProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  onClose: () => void;
}

const FilterPanel = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onClose,
}: FilterPanelProps) => {
  const categories = [
    { id: "all", name: "All Categories", count: 286 },
    { id: "materials", name: "Materials", count: 45 },
    { id: "safety", name: "Safety", count: 23 },
    { id: "tools", name: "Tools", count: 67 },
    { id: "lighting", name: "Lighting", count: 34 },
  ];

  const priceRanges = [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $250", min: 100, max: 250 },
    { label: "$250 - $500", min: 250, max: 500 },
    { label: "Over $500", min: 500, max: 1000 },
  ];

  const handlePriceRangeClick = (min: number, max: number) => {
    onPriceRangeChange([min, max]);
  };

  const resetFilters = () => {
    onCategoryChange("all");
    onPriceRangeChange([0, 1000]);
  };

  const applyFilters = () => {
    onClose();
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 w-80 h-full bg-white z-50 shadow-2xl overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Categories */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Categories
          </h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <span className="text-sm opacity-60">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Price Range
          </h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handlePriceRangeClick(range.min, range.max)}
                className={`w-full p-3 rounded-xl border text-left transition-all ${
                  priceRange[0] === range.min && priceRange[1] === range.max
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="font-medium">{range.label}</span>
              </button>
            ))}
          </div>

          {/* Custom Range Display */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[0]}
                onChange={(e) =>
                  onPriceRangeChange([Number(e.target.value), priceRange[1]])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceRangeChange([priceRange[0], Number(e.target.value)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <button
          onClick={resetFilters}
          className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Reset All Filters
        </button>
        <button
          onClick={applyFilters}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
};

export default FilterPanel;
