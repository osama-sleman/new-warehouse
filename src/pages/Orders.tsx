"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Phone,
  User,
  ChevronRight,
  Star,
  RefreshCw,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  code: string;
  category: string;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  status: "delivered" | "shipped" | "processing" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: "cash" | "syriatel";
  customerInfo: {
    name: string;
    phone: string;
  };
  deliveryInfo?: {
    driverName: string;
    driverPhone: string;
    estimatedTime: string;
  };
  orderNotes?: string;
  subtotal: number;
  shippingCost: number;
  rating?: number;
}

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      date: "2024-01-15T10:30:00Z",
      status: "delivered",
      total: 299.99,
      subtotal: 299.99,
      shippingCost: 0,
      shippingAddress: "Tartus, Syria",
      paymentMethod: "cash",
      rating: 5,
      customerInfo: {
        name: "Test User",
        phone: "+963 123 456 789",
      },
      deliveryInfo: {
        driverName: "Mohammed Ali",
        driverPhone: "+963 987 654 321",
        estimatedTime: "Delivered at 2:30 PM",
      },
      orderNotes: "Please call before delivery",
      items: [
        {
          name: "Industrial Steel Pipes",
          quantity: 1,
          price: 299.99,
          code: "SP-001",
          category: "materials",
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-10T14:15:00Z",
      status: "shipped",
      total: 89.98,
      subtotal: 89.98,
      shippingCost: 0,
      shippingAddress: "Tartus, Syria",
      paymentMethod: "syriatel",
      customerInfo: {
        name: "Test User",
        phone: "+963 123 456 789",
      },
      deliveryInfo: {
        driverName: "Omar Khalil",
        driverPhone: "+963 555 123 456",
        estimatedTime: "Expected today 4-6 PM",
      },
      items: [
        {
          name: "Safety Helmets",
          quantity: 2,
          price: 29.99,
          code: "SH-002",
          category: "safety",
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          name: "LED Work Lights",
          quantity: 1,
          price: 29.99,
          code: "LW-004",
          category: "lighting",
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-05T09:45:00Z",
      status: "processing",
      total: 159.98,
      subtotal: 159.98,
      shippingCost: 0,
      shippingAddress: "Tartus, Syria",
      paymentMethod: "cash",
      customerInfo: {
        name: "Test User",
        phone: "+963 123 456 789",
      },
      orderNotes: "Urgent delivery needed",
      items: [
        {
          name: "Power Drill Set",
          quantity: 1,
          price: 129.99,
          code: "PD-003",
          category: "tools",
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          name: "LED Work Lights",
          quantity: 1,
          price: 29.99,
          code: "LW-004",
          category: "lighting",
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
    },
    {
      id: "ORD-004",
      date: "2023-12-28T16:20:00Z",
      status: "cancelled",
      total: 51.98,
      subtotal: 45.99,
      shippingCost: 5.99,
      shippingAddress: "Damascus, Syria",
      paymentMethod: "syriatel",
      customerInfo: {
        name: "Test User",
        phone: "+963 123 456 789",
      },
      orderNotes: "Customer requested cancellation",
      items: [
        {
          name: "Industrial Steel Pipes",
          quantity: 1,
          price: 45.99,
          code: "SP-001",
          category: "materials",
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
    },
  ]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          icon: CheckCircle,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
          text: "Delivered",
        };
      case "shipped":
        return {
          icon: Truck,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
          dot: "bg-blue-500",
          text: "On the way",
        };
      case "processing":
        return {
          icon: Clock,
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          dot: "bg-amber-500",
          text: "Processing",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          dot: "bg-red-500",
          text: "Cancelled",
        };
      default:
        return {
          icon: Package,
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          dot: "bg-gray-500",
          text: "Unknown",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const handleReorder = (order: Order) => {
    console.log("Reordering:", order.id);
  };

  const handleRateOrder = (order: Order) => {
    console.log("Rating order:", order.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-500">Track and manage your order history</p>
          </motion.div>
        </div>
      </div>

      <div className="px-6 py-6">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 text-center shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              When you place your first order, it will appear here for easy
              tracking.
            </p>
            <motion.a
              href="/products"
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              <Package className="w-5 h-5" />
              Start Shopping
            </motion.a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    {/* Order Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              {order.id}
                            </h3>
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${statusConfig.dot}`}
                              />
                              <span
                                className={`text-sm font-semibold ${statusConfig.color}`}
                              >
                                {statusConfig.text}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(order.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{order.shippingAddress}</span>
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 3).map((_item, idx) => (
                                <div
                                  key={idx}
                                  className="w-12 h-12 bg-gray-100 rounded-xl border-2 border-white flex items-center justify-center"
                                >
                                  <div className="w-6 h-6 bg-gray-300 rounded" />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-12 h-12 bg-gray-100 rounded-xl border-2 border-white flex items-center justify-center">
                                  <span className="text-xs font-semibold text-gray-600">
                                    +{order.items.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {order.items.length}{" "}
                                {order.items.length === 1 ? "item" : "items"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.items
                                  .slice(0, 2)
                                  .map((item) => item.name)
                                  .join(", ")}
                                {order.items.length > 2 && "..."}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-gray-900">
                              ${order.total.toFixed(2)}
                            </div>
                            <div className="flex items-center gap-2">
                              {order.status === "delivered" &&
                                !order.rating && (
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRateOrder(order)}
                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-medium hover:bg-yellow-100 transition-colors border border-yellow-200"
                                  >
                                    <Star className="w-4 h-4" />
                                    Rate
                                  </motion.button>
                                )}

                              {order.rating && (
                                <div className="flex items-center gap-1 px-3 py-2 bg-yellow-50 rounded-xl">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < order.rating!
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}

                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedOrder(order)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                              >
                                Details
                                <ChevronRight className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      {order.status === "delivered" && (
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReorder(order)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Reorder
                          </motion.button>
                        </div>
                      )}

                      {order.status === "shipped" && order.deliveryInfo && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Truck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-blue-900">
                                Out for delivery
                              </p>
                              <p className="text-sm text-blue-700">
                                {order.deliveryInfo.estimatedTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {order.status === "processing" && (
                        <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                              <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-amber-900">
                                Being prepared
                              </p>
                              <p className="text-sm text-amber-700">
                                We'll notify you when it's ready
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl"
            >
              <div className="h-full flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedOrder.id}
                    </h2>
                    <p className="text-gray-500">
                      {formatDate(selectedOrder.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Order Status
                    </h3>
                    <div className="flex items-center gap-4">
                      {(() => {
                        const config = getStatusConfig(selectedOrder.status);
                        const StatusIcon = config.icon;
                        return (
                          <div
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${config.bg} ${config.border} border`}
                          >
                            <StatusIcon className={`w-6 h-6 ${config.color}`} />
                            <span className={`font-semibold ${config.color}`}>
                              {config.text}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Items Ordered
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-400 rounded" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Code: {item.code}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                              {item.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Delivery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Payment
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          {selectedOrder.paymentMethod === "cash" ? (
                            <DollarSign className="w-5 h-5 text-gray-600" />
                          ) : (
                            <CreditCard className="w-5 h-5 text-gray-600" />
                          )}
                          <span className="font-medium">
                            {selectedOrder.paymentMethod === "cash"
                              ? "Cash on Delivery"
                              : "Syriatel Cash"}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                              ${selectedOrder.subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">
                              {selectedOrder.shippingCost === 0 ? (
                                <span className="text-emerald-600">FREE</span>
                              ) : (
                                `$${selectedOrder.shippingCost.toFixed(2)}`
                              )}
                            </span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span>${selectedOrder.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Delivery
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">
                            {selectedOrder.shippingAddress}
                          </span>
                        </div>
                        {selectedOrder.deliveryInfo && (
                          <>
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-gray-600" />
                              <span>
                                {selectedOrder.deliveryInfo.driverName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-gray-600" />
                              <span>
                                {selectedOrder.deliveryInfo.driverPhone}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-gray-600" />
                              <span>
                                {selectedOrder.deliveryInfo.estimatedTime}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {selectedOrder.orderNotes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Order Notes
                      </h3>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                        <p className="text-yellow-800">
                          {selectedOrder.orderNotes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                {selectedOrder.status === "delivered" && (
                  <div className="p-6 border-t border-gray-100">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReorder(selectedOrder)}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Reorder Items
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Orders;
