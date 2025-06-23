"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

// Payment method types
export type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  icon: "cash" | "mobile";
  availableForCities: string[]; // City IDs where this payment method is available
};

// Available payment methods
const paymentMethods: PaymentMethod[] = [
  {
    id: "cash",
    name: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: "cash",
    availableForCities: ["tartus"], // Only available in Tartus
  },
  {
    id: "syriatel",
    name: "Syriatel Cash",
    description: "Pay using your Syriatel account",
    icon: "mobile",
    availableForCities: [
      "tartus",
      "damascus",
      "aleppo",
      "homs",
      "latakia",
      "other",
    ], // Available everywhere
  },
];

const PaymentSelector = () => {
  const { state, dispatch } = useCart();
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  // Filter payment methods based on selected city
  useEffect(() => {
    if (state.shipping) {
      const cityId = state.shipping.id;
      const methods = paymentMethods.filter((method) =>
        method.availableForCities.includes(cityId)
      );
      setAvailableMethods(methods);

      // Reset selection if current selection is not available
      if (selectedMethod && !methods.some((m) => m.id === selectedMethod)) {
        setSelectedMethod(null);
      }

      // Auto-select if only one option
      if (methods.length === 1 && !selectedMethod) {
        setSelectedMethod(methods[0].id);
      }
    } else {
      setAvailableMethods([]);
      setSelectedMethod(null);
    }
  }, [state.shipping, selectedMethod]);

  // Update cart context with selected payment method
  useEffect(() => {
    if (selectedMethod) {
      dispatch({
        type: "SET_PAYMENT_METHOD",
        payload: selectedMethod,
      });
    }
  }, [selectedMethod, dispatch]);

  const handleSelectPayment = (methodId: string) => {
    setSelectedMethod(methodId);
    setIsOpen(false);
  };

  if (!state.shipping) {
    return null; // Don't show payment options until shipping is selected
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-blue-600 font-medium hover:text-blue-800"
        >
          {isOpen ? "Close" : "Change"}
        </button>
      </div>

      {!isOpen && selectedMethod ? (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                {selectedMethod === "cash" ? (
                  <DollarSign className="w-4 h-4 text-blue-600" />
                ) : (
                  <CreditCard className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {
                    paymentMethods.find((m) => m.id === selectedMethod)
                      ?.description
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={
            isOpen ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }
          }
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="space-y-2">
            {availableMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleSelectPayment(method.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                  selectedMethod === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedMethod === method.id
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {method.icon === "cash" ? (
                      <DollarSign
                        className={`w-4 h-4 ${
                          selectedMethod === method.id
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      />
                    ) : (
                      <CreditCard
                        className={`w-4 h-4 ${
                          selectedMethod === method.id
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-xs text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {availableMethods.length === 0 && state.shipping && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          Please select a shipping location to see available payment methods.
        </div>
      )}
    </div>
  );
};

export default PaymentSelector;
