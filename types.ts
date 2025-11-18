export interface Subscription {
  startDate: string; // ISO string
  endDate: string;   // ISO string
}

export type SubscriptionType = 'monthly' | 'annual' | 'trial';

export interface Client {
  id: string;
  name: string;
  surname: string;
  companyName?: string;
  vatNumber?: string;
  address: string;
  email: string;
  iban?: string;
  otherInfo?: string;
  subscription: Subscription;
  subscriptionType: SubscriptionType;
  productId?: string;
  sellerId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface Seller {
  id: string;
  name: string;
  commissionRate: number; // Percentage
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT';
  entity: 'CLIENT' | 'PRODUCT' | 'SELLER';
  description: string;
  entityId?: string; // ID of the client, product, or seller
}