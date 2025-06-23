"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Bell,
  Globe,
  MapPin,
  Shield,
  HelpCircle,
  Palette,
  Smartphone,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  Download,
  MessageCircle,
  Info,
  RefreshCw,
} from "lucide-react";
import { useTelegram } from "../context/TelegramContext";
import { useAuth } from "../context/AuthContext";

interface SettingsModalProps {
  onClose: () => void;
}

interface SettingsState {
  notifications: {
    orderUpdates: boolean;
    stockAlerts: boolean;
    promotions: boolean;
    deliveryUpdates: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    theme: string;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
  address: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    additionalInfo: string;
  };
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const { user: telegramUser } = useTelegram();
  const {
    user: authUser,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    isLoading,
  } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      orderUpdates: true,
      stockAlerts: true,
      promotions: false,
      deliveryUpdates: true,
    },
    preferences: {
      language: "English",
      currency: "USD",
      theme: "light",
    },
    privacy: {
      shareData: true,
      analytics: true,
    },
    address: {
      fullName: authUser?.first_name + " " + (authUser?.last_name || "") || "",
      phoneNumber: authUser?.phone || "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
      additionalInfo: "",
    },
  });

  const toggleSetting = (category: keyof SettingsState, setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]:
          !prev[category][setting as keyof (typeof prev)[typeof category]],
      },
    }));
  };

  const updateSetting = (
    category: keyof SettingsState,
    setting: string,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇾" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "SYP", name: "Syrian Pound", symbol: "ل.س", flag: "🇸🇾" },
  ];

  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "SY", name: "Syria", flag: "🇸🇾" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
  ];

  const CustomDropdown = ({
    label,
    value,
    options,
    onSelect,
    dropdownKey,
  }: {
    label: string;
    value: string;
    options: Array<{
      code: string;
      name: string;
      flag?: string;
      symbol?: string;
    }>;
    onSelect: (value: string) => void;
    dropdownKey: string;
  }) => {
    const selectedOption = options.find(
      (opt) => opt.code === value || opt.name === value
    );
    const isOpen = openDropdown === dropdownKey;

    return (
      <div className="relative">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        <button
          onClick={() => setOpenDropdown(isOpen ? null : dropdownKey)}
          className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            {selectedOption?.flag && (
              <span className="text-lg">{selectedOption.flag}</span>
            )}
            <span className="text-sm font-medium text-gray-900">
              {selectedOption?.name || value}
              {selectedOption?.symbol && ` (${selectedOption.symbol})`}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={option.code}
                onClick={() => {
                  onSelect(option.code);
                  setOpenDropdown(null);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                {option.flag && <span className="text-lg">{option.flag}</span>}
                <span className="text-sm font-medium text-gray-900">
                  {option.name}
                  {option.symbol && ` (${option.symbol})`}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  const settingsCategories = [
    {
      id: "profile",
      title: "Profile & Account",
      icon: User,
      description: "Manage your personal information",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      description: "Control your notification preferences",
    },
    {
      id: "language",
      title: "Language & Currency",
      icon: Globe,
      description: "Set your language and currency",
    },
    {
      id: "address",
      title: "Default Address",
      icon: MapPin,
      description: "Manage your default delivery address",
    },
    {
      id: "display",
      title: "Display & Theme",
      icon: Palette,
      description: "Customize app appearance",
    },
    {
      id: "privacy",
      title: "Privacy & Data",
      icon: Shield,
      description: "Manage your privacy settings",
    },
    {
      id: "integration",
      title: "Telegram Integration",
      icon: Smartphone,
      description: "Telegram bot and sync settings",
    },
    {
      id: "support",
      title: "Support & Help",
      icon: HelpCircle,
      description: "Get help and contact support",
    },
  ];

  const renderSettingSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-4">
            {/* Telegram Account Section */}
            <div className="text-center pb-4 border-b border-gray-100">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                <span className="text-2xl font-bold text-white">
                  {(authUser?.first_name || telegramUser?.first_name)?.charAt(
                    0
                  ) || "U"}
                </span>
                {isAuthenticated && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Smartphone className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {authUser?.first_name || telegramUser?.first_name}{" "}
                {authUser?.last_name || telegramUser?.last_name}
              </h3>
              <p className="text-sm text-gray-500">
                @{authUser?.username || telegramUser?.username || "username"}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isAuthenticated ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-xs font-medium ${
                    isAuthenticated ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isAuthenticated ? "Connected via Telegram" : "Not connected"}
                </span>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-3">
              <div
                className={`p-3 rounded-xl border ${
                  isAuthenticated
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Smartphone
                    className={`w-5 h-5 ${
                      isAuthenticated ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isAuthenticated ? "text-blue-900" : "text-gray-700"
                      }`}
                    >
                      Telegram Account
                    </p>
                    <p
                      className={`text-xs ${
                        isAuthenticated ? "text-blue-700" : "text-gray-500"
                      }`}
                    >
                      ID: {authUser?.id || telegramUser?.id || "Not connected"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isAuthenticated ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-medium ${
                        isAuthenticated ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isAuthenticated ? "Active" : "Disconnected"}
                    </span>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <>
                  {/* Connected Account Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Full Name
                        </p>
                        <p className="text-sm text-gray-500">
                          {authUser?.first_name} {authUser?.last_name || ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Username
                        </p>
                        <p className="text-sm text-gray-500">
                          @{authUser?.username || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Email
                        </p>
                        <p className="text-sm text-gray-500">
                          {authUser?.email || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-5 h-5 text-gray-400 ${
                          isLoading ? "animate-spin" : ""
                        }`}
                      />
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Update Profile
                        </p>
                        <p className="text-xs text-gray-500">
                          Sync latest info from Telegram
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                    >
                      <X className="w-5 h-5 text-red-500" />
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium text-red-700">
                          Disconnect Account
                        </p>
                        <p className="text-xs text-red-500">
                          You'll need to reconnect to place orders
                        </p>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Not Connected State */}
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Connect Your Telegram Account
                    </h4>
                    <p className="text-sm text-gray-500 mb-6">
                      Sign in with your Telegram account to access all features
                      and place orders.
                    </p>

                    <button
                      onClick={handleLogin}
                      disabled={isLoading || !telegramUser}
                      className="w-full flex items-center justify-center gap-3 p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-5 h-5" />
                          <span>Connect Telegram Account</span>
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400">
                      By connecting, you agree to our Terms of Service and
                      Privacy Policy
                    </p>
                  </div>

                  {/* Benefits of Connecting */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-900">
                      Benefits of connecting:
                    </h5>
                    <div className="space-y-2">
                      {[
                        "Place orders and checkout",
                        "Sync orders across devices",
                        "Receive order notifications",
                        "Secure account access",
                        "Personalized experience",
                      ].map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {key === "orderUpdates" &&
                      "Get notified about order status changes"}
                    {key === "stockAlerts" &&
                      "Receive alerts when items are low in stock"}
                    {key === "promotions" &&
                      "Receive promotional offers and discounts"}
                    {key === "deliveryUpdates" &&
                      "Get updates about delivery status"}
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting("notifications", key)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    value ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      value ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        );

      case "language":
        return (
          <div className="space-y-6">
            <CustomDropdown
              label="Language"
              value={settings.preferences.language}
              options={languages}
              onSelect={(value) =>
                updateSetting("preferences", "language", value)
              }
              dropdownKey="language"
            />
            <CustomDropdown
              label="Currency"
              value={settings.preferences.currency}
              options={currencies}
              onSelect={(value) =>
                updateSetting("preferences", "currency", value)
              }
              dropdownKey="currency"
            />
          </div>
        );

      case "address":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </p>
                <input
                  type="text"
                  value={settings.address.fullName}
                  onChange={(e) =>
                    updateSetting("address", "fullName", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </p>
                <input
                  type="tel"
                  value={settings.address.phoneNumber}
                  onChange={(e) =>
                    updateSetting("address", "phoneNumber", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Street Address
              </p>
              <input
                type="text"
                value={settings.address.streetAddress}
                onChange={(e) =>
                  updateSetting("address", "streetAddress", e.target.value)
                }
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">City</p>
                <input
                  type="text"
                  value={settings.address.city}
                  onChange={(e) =>
                    updateSetting("address", "city", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  State/Province
                </p>
                <input
                  type="text"
                  value={settings.address.state}
                  onChange={(e) =>
                    updateSetting("address", "state", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Postal Code
                </p>
                <input
                  type="text"
                  value={settings.address.postalCode}
                  onChange={(e) =>
                    updateSetting("address", "postalCode", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10001"
                />
              </div>
              <div>
                <CustomDropdown
                  label="Country"
                  value={settings.address.country}
                  options={countries}
                  onSelect={(value) =>
                    updateSetting("address", "country", value)
                  }
                  dropdownKey="country"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Additional Information
              </p>
              <textarea
                value={settings.address.additionalInfo}
                onChange={(e) =>
                  updateSetting("address", "additionalInfo", e.target.value)
                }
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Delivery instructions, landmarks, etc."
              />
            </div>
          </div>
        );

      case "display":
        return (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-900 mb-3">Theme</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 border-2 border-blue-500 rounded-lg bg-white">
                  <div className="w-full h-8 bg-gray-100 rounded mb-2"></div>
                  <p className="text-xs font-medium">Light</p>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg bg-gray-900">
                  <div className="w-full h-8 bg-gray-700 rounded mb-2"></div>
                  <p className="text-xs font-medium text-white">Dark</p>
                </button>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Layout Density
              </p>
              <select className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Compact</option>
                <option>Comfortable</option>
                <option>Spacious</option>
              </select>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {key === "shareData" ? "Share Usage Data" : "Analytics"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {key === "shareData"
                      ? "Help improve the app by sharing usage data"
                      : "Allow analytics to improve your experience"}
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting("privacy", key)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    value ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      value ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Download className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Export Data</p>
                <p className="text-xs text-gray-500">
                  Download your order history and data
                </p>
              </div>
            </button>
          </div>
        );

      case "integration":
        return (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="w-5 h-5 text-blue-500" />
                <p className="text-sm font-medium text-blue-900">
                  Telegram Integration
                </p>
              </div>
              <p className="text-xs text-blue-700">
                Connected to @WarehouseBot
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Bot Notifications
                  </p>
                  <p className="text-xs text-gray-500">
                    Receive order updates via Telegram bot
                  </p>
                </div>
                <button className="w-12 h-6 bg-blue-500 rounded-full">
                  <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto Sync</p>
                  <p className="text-xs text-gray-500">
                    Automatically sync data with Telegram
                  </p>
                </div>
                <button className="w-12 h-6 bg-blue-500 rounded-full">
                  <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                </button>
              </div>
            </div>
          </div>
        );

      case "support":
        return (
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MessageCircle className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  Contact Support
                </p>
                <p className="text-xs text-gray-500">
                  Get help from our support team
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Help Center</p>
                <p className="text-xs text-gray-500">
                  Browse frequently asked questions
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Info className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">About</p>
                <p className="text-xs text-gray-500">
                  App version, terms, and privacy policy
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          onClose();
          setOpenDropdown(null);
        }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {activeSection && (
              <button
                onClick={() => setActiveSection(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {activeSection
                ? settingsCategories.find((cat) => cat.id === activeSection)
                    ?.title
                : "Settings"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {activeSection ? (
            <div className="p-4">{renderSettingSection()}</div>
          ) : (
            <div className="p-4 space-y-2">
              {settingsCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveSection(category.id)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {category.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SettingsModal;
