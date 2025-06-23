"use client";

import { useLocation, Link } from "react-router-dom";
import { Home, Package, ShoppingCart, FileText } from "lucide-react";
import { useCart } from "../context/CartContext";

const BottomNav = () => {
  const location = useLocation();
  const { state } = useCart();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/products", label: "Catalog", icon: Package },
    { path: "/cart", label: "Cart", icon: ShoppingCart },
    { path: "/orders", label: "Orders", icon: FileText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.path === "/cart" && state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
