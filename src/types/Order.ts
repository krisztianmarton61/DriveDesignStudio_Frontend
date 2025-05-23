export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IOrder {
  id?: string;
  email: string;
  password?: string;
  userId?: string;
  billingInformation: {
    compapany?: string;
    taxId?: string;
    firstName: string;
    lastName: string;
    address: string;
    county: string;
    city: string;
    phone: string;
    country: string;
  };
  shippingInformation?: {
    firstName: string;
    lastName: string;
    address: string;
    county: string;
    city: string;
    phone: string;
    country: string;
  };
  products: { productId: string; quantity: number; imageId: string }[];
  status?: OrderStatus;
  timestamp?: string;
}
