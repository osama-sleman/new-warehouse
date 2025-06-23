"use client";

import { useState } from "react";
import { Settings, ChevronDown, LogOut, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelegram } from "../context/TelegramContext";
import { useAuth } from "../context/AuthContext";
import SettingsModal from "./SettingsModal";
import LoginPrompt from "./LoginPrompt";

const Header = () => {
  const { user: telegramUser } = useTelegram();
  const { user: authUser, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // For testing - simulate being logged in
  const displayUser = authUser ||
    telegramUser || {
      first_name: "Test User",
      last_name: "Account",
      username: "testuser",
    };
  const userInitial = displayUser?.first_name?.charAt(0) || "T";
  const isTestMode = !authUser && !telegramUser; // Simulate login for testing

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const menuItems = [
    {
      icon: Inbox,
      title: "Inbox",
      description: "3 unread messages",
      action: () => setShowProfileMenu(false),
    },
    {
      icon: Settings,
      title: "Settings",
      description: "App preferences & configuration",
      action: () => {
        setShowProfileMenu(false);
        setShowSettings(true);
      },
    },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-md"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Warehouse</h1>
                <p className="text-xs text-gray-500">Inventory Management</p>
              </div>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileClick}
                className="flex items-center gap-2 px-3 py-2 rounded-full transition-colors bg-blue-50 border border-blue-200 hover:bg-blue-100"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {userInitial}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {displayUser?.first_name}
                  {isTestMode && (
                    <span className="text-xs text-blue-600 ml-1">(Test)</span>
                  )}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />

                    {/* Dropdown Menu */}
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                    >
                      {/* User Info Header */}
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">
                              {userInitial}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-lg truncate">
                              {displayUser?.first_name}{" "}
                              {displayUser?.last_name || ""}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              @{displayUser?.username || "username"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">
                                {isTestMode ? "Test Mode" : "Connected"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-3">
                        <div className="space-y-1">
                          {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                              <motion.button
                                key={index}
                                whileHover={{
                                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={item.action}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 transition-all duration-200 text-left group"
                              >
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                  <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-900">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-gray-500 group-hover:text-blue-600 truncate">
                                    {item.description}
                                  </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg] group-hover:text-blue-500" />
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Logout Section */}
                        <div className="border-t border-gray-100 mt-4 pt-3">
                          <motion.button
                            whileHover={{
                              backgroundColor: "rgba(239, 68, 68, 0.05)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 transition-all duration-200 text-left group"
                          >
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <LogOut className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-red-700 group-hover:text-red-800">
                                {isTestMode ? "Exit Test Mode" : "Sign Out"}
                              </p>
                              <p className="text-xs text-red-500">
                                {isTestMode
                                  ? "Return to login screen"
                                  : "Disconnect from Telegram"}
                              </p>
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
        {showLoginPrompt && (
          <LoginPrompt onClose={() => setShowLoginPrompt(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
