export interface CoinHistory {
  type: "earn" | "spend";
  amount: number;
  reason: string;
  createdAt: Date;
}

export interface CandyCoins {
  userId: string;
  clerkId: string;
  currentCoins: number;
  totalSpend: number;
  totalEarned: number;
  history: History[];
}
