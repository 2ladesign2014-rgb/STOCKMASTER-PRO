
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
  price: number;
  supplier: string;
  lastUpdated: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  paidAmount: number;
}

export type PaymentMethod = 
  | 'Orange Money' 
  | 'MTN Money' 
  | 'Moov Money' 
  | 'Wave Money' 
  | 'Virement Bancaire' 
  | 'Transfert Bancaire' 
  | 'Espèces';

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference?: string;
  note?: string;
  affectedProductIds?: string[];
}

export interface PaymentSchedule {
  id: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface Order {
  id: string;
  clientId: string;
  items: OrderItem[];
  status: 'draft' | 'confirmed' | 'shipped' | 'paid' | 'partially_paid' | 'unpaid';
  date: string;
  totalAmount: number;
  paidAmount: number;
  payments: PaymentRecord[];
  schedules: PaymentSchedule[];
}

export type DeliveryStatus = 'preparing' | 'pending_shipment' | 'shipped' | 'delivered' | 'cancelled';

export interface Delivery {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: DeliveryStatus;
  estimatedArrival: string;
  actualArrival?: string;
  shippedDate?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  user: string;
}

export interface StoreConfig {
  name: string;
  logoUrl: string;
  address: string;
  email: string;
  phone: string;
  slogan: string;
  pinCode: string;
}

export type ViewType = 'dashboard' | 'inventory' | 'transactions' | 'ai-insights' | 'clients' | 'orders' | 'deliveries' | 'api-docs' | 'settings';

export interface StockStats {
  totalValue: number;
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
}
