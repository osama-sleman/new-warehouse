"use client";

import { motion } from "framer-motion";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const categories = [
    { id: "all", name: "All" },
    { id: "materials", name: "Materials" },
    { id: "safety", name: "Safety" },
    { id: "tools", name: "Tools" },
    { id: "lighting", name: "Lighting" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={`px-6 py-3 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
            selectedCategory === category.id
              ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
              : "bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
