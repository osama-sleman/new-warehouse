"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    "iPhone",
    "Laptop",
    "Chair",
    "Book",
    "Hammer",
    "Football",
    "Headphones",
    "Desk",
    "Novel",
    "Screwdriver",
    "Basketball",
  ];

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = popularSearches.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="search-container">
      <motion.div
        className={`search-bar ${isFocused ? "focused" : ""}`}
        whileFocus={{ scale: 1.02 }}
      >
        <div className="search-icon">🔍</div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="search-input"
        />
        {searchTerm && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearSearch}
            className="clear-search"
          >
            ❌
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {isFocused && (suggestions.length > 0 || searchTerm.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="search-suggestions"
          >
            {searchTerm.length === 0 ? (
              <>
                <div className="suggestions-header">Popular Searches</div>
                {popularSearches.slice(0, 6).map((item, index) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(item)}
                    className="suggestion-item popular"
                  >
                    <span className="suggestion-icon">🔥</span>
                    {item}
                  </motion.button>
                ))}
              </>
            ) : (
              <>
                <div className="suggestions-header">Suggestions</div>
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-item"
                  >
                    <span className="suggestion-icon">🔍</span>
                    {suggestion}
                  </motion.button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
