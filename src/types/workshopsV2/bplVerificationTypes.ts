export interface BplVerificationTypes {
  _id?: string;
  rationCardNumber: string;
  state: string;
  district: string;
  headOfFamilyName: string;
  mobileNumber: number;
  document: string;
  status?: "Approved" | "Rejected" | "Pending";
}
