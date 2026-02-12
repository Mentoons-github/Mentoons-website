export interface EmiStatistics {
  totalEmiAmount: number;
  paidAmount: number;
  remainingAmount: number;
  totalEmis: number;
  paidEmis: number;
  pendingEmis: number;
  nextDueDate: string | null;
}
