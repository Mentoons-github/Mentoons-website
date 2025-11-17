export interface Celebration {
  name: string;
  picture?: string;
  gender?: string;
  phoneNumber?: string;
  type: string;
  date: string;
}

export interface UpcomingCelebration extends Celebration {
  daysUntil: number;
}

export interface ApiErrorResponse {
  message: string;
}
