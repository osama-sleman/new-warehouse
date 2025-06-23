export interface ShippingOption {
    id: string
    city: string
    cost: number
    estimatedDays: string
  }
  
  // This would eventually come from the dashboard/backend
  export const shippingOptions: ShippingOption[] = [
    {
      id: "tartus",
      city: "Tartus",
      cost: 0, // Free shipping
      estimatedDays: "1-2",
    },
    {
      id: "damascus",
      city: "Damascus",
      cost: 5.99,
      estimatedDays: "2-3",
    },
    {
      id: "aleppo",
      city: "Aleppo",
      cost: 7.99,
      estimatedDays: "2-4",
    },
    {
      id: "homs",
      city: "Homs",
      cost: 4.99,
      estimatedDays: "1-3",
    },
    {
      id: "latakia",
      city: "Latakia",
      cost: 3.99,
      estimatedDays: "1-2",
    },
    {
      id: "other",
      city: "Other Cities",
      cost: 9.99,
      estimatedDays: "3-5",
    },
  ]
  