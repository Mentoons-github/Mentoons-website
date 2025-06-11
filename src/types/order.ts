export interface OrderItem {
  productImage: string;
  productId: string;
  productName: string;
  productType: "cards" | "book" | "session";
  quantity: number;
  price: number;
  hasReviewed: boolean;
}

export interface OrderData {
  orderId: string;
  productInfo: string;
  order_type:
    | "product_purchase"
    | "subscription_purchase"
    | "consultancy_purchase"
    | "assessment_purchase";
  customerName: string;
  email: string;
  phone: string;
  totalAmount: number;
  purchaseDate: string;
  status:
    | "PENDING"
    | "SUCCESS"
    | "FAILURE"
    | "ABORTED"
    | "INVALID"
    | "CANCELLED"
    | "UNKNOWN";
  items: OrderItem[];
  transactionId?: string;
}
