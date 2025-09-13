export interface ServiceProps {
  serviceId: string;
  name: string;
  description: string;
  rentalPrice: number;
  deposit: number;
  quantity: number;
  rentalPeriod: number;
  condition: string;
  images: Image[];
  available: boolean;
  categoryId: string;
}

export interface Image {
  id: string;
  serviceId: string;
  url: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}
