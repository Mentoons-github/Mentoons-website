export interface Membership {
  benefits: Features[];
  price: number;
  character: string;
  type: string;
}

interface Features {
  feature: string;
  details: string;
  important?: boolean;
}

export type Color = {
  text: string;
  color: string;
};
