export type Tbike = {
  name: string;
  brand: string;
  model: string;
  price: number;
  image?: string;
  category: 'Mountain' | 'Road' | 'Hybrid' | 'Electric';
  description: string;
  quantity: number;
  inStock: boolean;
};
