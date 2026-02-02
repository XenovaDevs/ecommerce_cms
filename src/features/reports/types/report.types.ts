export interface SalesReportData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  dailySales: DailySale[];
}

export interface DailySale {
  date: string;
  sales: number;
  orders: number;
}

export interface ProductsReportData {
  topProducts: TopProduct[];
}

export interface TopProduct {
  id: string;
  name: string;
  quantitySold: number;
  revenue: number;
  image?: string;
}

export interface CustomersReportData {
  topCustomers: TopCustomer[];
  newCustomers: NewCustomer[];
  totalCustomers: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

export interface NewCustomer {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  firstOrderDate?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  limit?: number;
}
