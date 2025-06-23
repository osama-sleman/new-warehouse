"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Truck, Check } from "lucide-react"
import { useCart } from "../context/CartContext"
import { shippingOptions, type ShippingOption } from "../data/shippingData"

const ShippingSelector = () => {
  const { state, setShipping } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectShipping = (option: ShippingOption) => {
    setShipping(option)
    setIsOpen(false)
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Shipping</h3>
        <button onClick={() => setIsOpen(!isOpen)} className="text-xs text-blue-600 font-medium hover:text-blue-800">
          {isOpen ? "Close" : "Change"}
        </button>
      </div>

      {!isOpen && state.shipping ? (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{state.shipping.city}</p>
              <p className="text-xs text-gray-500">Delivery in {state.shipping.estimatedDays} days</p>
            </div>
            <div className="font-medium">
              {state.shipping.cost === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                <span>${state.shipping.cost.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={isOpen ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {shippingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectShipping(option)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                  state.shipping?.id === option.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      state.shipping?.id === option.id ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    {state.shipping?.id === option.id ? (
                      <Check className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Truck className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{option.city}</p>
                    <p className="text-xs text-gray-500">Delivery in {option.estimatedDays} days</p>
                  </div>
                </div>
                <div className="font-medium">
                  {option.cost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>${option.cost.toFixed(2)}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {!state.shipping && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 mt-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Select Shipping Option</span>
        </button>
      )}
    </div>
  )
}

export default ShippingSelector
