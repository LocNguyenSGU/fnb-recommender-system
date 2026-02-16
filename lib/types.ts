// TypeScript interfaces cho hệ thống

export interface Shop {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  address: string;
  latitude: number;
  longitude: number;
  open_time: string;
  close_time: string;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
  rating?: number;
  review_count?: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}
