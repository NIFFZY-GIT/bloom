export interface Place {
  id: number;
  name: string;
  description: string;
  image: string;
  categoryId: number;
  categoryName?: string;
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