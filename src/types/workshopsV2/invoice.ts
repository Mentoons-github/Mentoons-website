export interface Invoice {
  userId: string;
  planId: string;
  userPlanId: string;
  amount: number;
  paymentType: string;
  status: string;
  gateway: string;
  transactionId: string;
}
