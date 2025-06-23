interface OrderNotification {
    orderId: string
    type: "confirmation" | "preparing" | "out_for_delivery" | "delivered"
    customerName: string
    items: Array<{
      name: string
      quantity: number
      price: number
    }>
    total: number
    deliveryAddress: string
    paymentMethod: "cash" | "syriatel"
    estimatedDelivery?: string
    driverInfo?: {
      name: string
      phone: string
    }
  }
  
  export class NotificationService {
    // This would integrate with your Telegram bot API
    static async sendOrderNotification(notification: OrderNotification) {
      const message = this.formatMessage(notification)
  
      // In a real implementation, this would call your Telegram bot API
      console.log("Sending Telegram notification:", message)
  
      // For now, we'll simulate sending via the WebApp
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.sendData(
          JSON.stringify({
            type: "notification",
            message,
            orderId: notification.orderId,
          }),
        )
      }
    }
  
    private static formatMessage(notification: OrderNotification): string {
      switch (notification.type) {
        case "confirmation":
          return this.formatConfirmationMessage(notification)
        case "preparing":
          return this.formatPreparingMessage(notification)
        case "out_for_delivery":
          return this.formatOutForDeliveryMessage(notification)
        case "delivered":
          return this.formatDeliveredMessage(notification)
        default:
          return ""
      }
    }
  
    private static formatConfirmationMessage(notification: OrderNotification): string {
      const itemsList = notification.items
        .map((item) => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
        .join("\n")
  
      const paymentText =
        notification.paymentMethod === "cash" ? "💰 Payment: Cash on Delivery" : "💳 Payment: Syriatel Cash"
  
      return `✅ Order Confirmed
  
  📦 Order #${notification.orderId}
  📅 Date: ${new Date().toLocaleDateString()}
  🚚 Delivery to: ${notification.deliveryAddress}
  ${paymentText}
  
  📋 Items:
  ${itemsList}
  
  💵 Total${notification.paymentMethod === "cash" ? " to pay on delivery" : ""}: $${notification.total.toFixed(2)}
  
  📞 Our delivery team will contact you within 24 hours to schedule delivery.
  
  Track your order: /track_${notification.orderId}`
    }
  
    private static formatPreparingMessage(notification: OrderNotification): string {
      return `📦 Order Update - ${notification.orderId}
  
  Your order is being prepared for delivery.
  ${notification.estimatedDelivery ? `Estimated delivery: ${notification.estimatedDelivery}` : ""}
  
  Need to reschedule? Reply to this message.`
    }
  
    private static formatOutForDeliveryMessage(notification: OrderNotification): string {
      const driverInfo = notification.driverInfo
        ? `Driver: ${notification.driverInfo.name} (${notification.driverInfo.phone})`
        : "Driver will contact you shortly"
  
      const cashReminder =
        notification.paymentMethod === "cash" ? `\n💰 Please have $${notification.total.toFixed(2)} ready in cash.` : ""
  
      return `🚚 Out for Delivery - ${notification.orderId}
  
  Your order is on the way!
  ${driverInfo}
  Expected arrival: 30-45 minutes
  ${cashReminder}`
    }
  
    private static formatDeliveredMessage(notification: OrderNotification): string {
      return `✅ Order Delivered - ${notification.orderId}
  
  Thank you for your ${notification.paymentMethod === "cash" ? "payment" : "order"}!
  📅 Delivered: ${new Date().toLocaleString()}
  
  Rate your experience: ⭐⭐⭐⭐⭐
  Leave feedback: /feedback_${notification.orderId}
  
  Browse more products: /catalog`
    }
  }
  