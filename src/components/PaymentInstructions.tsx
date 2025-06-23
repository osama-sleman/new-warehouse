"use client";

import { motion } from "framer-motion";
import { CreditCard, DollarSign, Copy, Check } from "lucide-react";
import { useState } from "react";

interface PaymentInstructionsProps {
  paymentMethod: string;
  amount: number;
  orderId: string;
  onClose: () => void;
}

const PaymentInstructions = ({
  paymentMethod,
  amount,
  orderId,
  onClose,
}: PaymentInstructionsProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {paymentMethod === "cash" ? (
              <DollarSign className="w-8 h-8 text-blue-600" />
            ) : (
              <CreditCard className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Payment Instructions
          </h2>
          <p className="text-gray-500">
            {paymentMethod === "cash"
              ? "Your order will be delivered with cash payment option"
              : "Complete your payment with Syriatel Cash"}
          </p>
        </div>

        {paymentMethod === "syriatel" && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">
              Follow these steps:
            </h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="bg-blue-100 text-blue-600 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span>Open your Syriatel Cash app</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-100 text-blue-600 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span>Select "Pay Merchant"</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-100 text-blue-600 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span>
                  Enter the merchant code: <strong>WAREHOUSE123</strong>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-100 text-blue-600 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  4
                </span>
                <span>
                  Enter the amount: <strong>${amount.toFixed(2)}</strong>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="bg-blue-100 text-blue-600 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  5
                </span>
                <span>Enter the reference number below</span>
              </li>
            </ol>

            <div className="mt-4">
              <label className="block text-xs text-gray-500 mb-1">
                Reference Number (Order ID)
              </label>
              <div className="flex">
                <div className="flex-1 bg-white border border-gray-200 rounded-l-lg p-3 font-mono text-gray-900">
                  {orderId}
                </div>
                <button
                  onClick={() => copyToClipboard(orderId)}
                  className="bg-blue-100 text-blue-600 px-3 rounded-r-lg flex items-center justify-center"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "cash" && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">
              Cash on Delivery Details:
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Your order will be delivered to your address in Tartus. Please
              have the exact amount ready for payment.
            </p>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-600">Amount to pay:</span>
              <span className="font-bold text-gray-900">
                ${amount.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mb-6">
          Your order ID is <strong>{orderId}</strong>. Please save this for
          reference.
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            View Orders
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentInstructions;
