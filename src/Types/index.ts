export interface Place {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  color: string;
  bgColor: string;
  description: string;
  animation: string;
}