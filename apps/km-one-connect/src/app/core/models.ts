export interface CarOwner {
  id: string;
  name: string;
  memberSince: string;
  rating: number;
  responseTime: string;
  avatarInitials: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  neighborhood: string;
  dailyPrice: number;
  transmission: 'Automático' | 'Manual';
  rating: number;
  reviews: number;
  available: boolean;
  category: string;
  color: string;
  seats: number;
  imageClass: string;
  description: string;
  features: string[];
  rules: string[];
  owner: CarOwner;
}

export interface Booking {
  id: string;
  carId: string;
  carName: string;
  period: string;
  total: number;
  status: 'Confirmada' | 'Concluída' | 'Aguardando';
  location: string;
}

export interface RentalRequest {
  id: string;
  carName: string;
  renterName: string;
  period: string;
  total: number;
  status: 'Pendente' | 'Aprovada' | 'Recusada';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
  tone: 'green' | 'blue' | 'orange' | 'purple';
}
