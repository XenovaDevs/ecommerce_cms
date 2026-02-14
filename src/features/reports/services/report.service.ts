import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type {
  SalesReportData,
  ProductsReportData,
  CustomersReportData,
} from '../types/report.types';

export interface GetSalesReportParams {
  startDate: string;
  endDate: string;
}

export interface GetProductsReportParams {
  limit?: number;
}

export interface GetCustomersReportParams {
  startDate: string;
  endDate: string;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toArray<T = Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

class ReportService {
  async getSalesReport(params: GetSalesReportParams): Promise<SalesReportData> {
    const response = await apiClient.get<any>(API_ENDPOINTS.REPORTS.SALES, {
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
      },
    });
    const payload = response.data ?? {};
    const dailySales = toArray<any>(payload.daily_sales).map((sale) => ({
      date: String(sale.date ?? ''),
      sales: toNumber(sale.sales ?? sale.revenue),
      orders: toNumber(sale.orders),
    }));

    return {
      totalSales: toNumber(payload.total_sales ?? payload.totalSales ?? payload.total_revenue),
      totalOrders: toNumber(payload.total_orders ?? payload.totalOrders),
      averageOrderValue: toNumber(payload.average_order_value ?? payload.averageOrderValue),
      dailySales,
    };
  }

  async getProductsReport(params: GetProductsReportParams = {}): Promise<ProductsReportData> {
    const response = await apiClient.get<any>(API_ENDPOINTS.REPORTS.PRODUCTS, {
      params: {
        limit: params.limit ?? 10,
      },
    });
    const payload = response.data ?? {};
    const topProducts = toArray<any>(payload.top_products ?? payload.topProducts).map((product) => ({
      id: String(product.id ?? ''),
      name: String(product.name ?? 'Unnamed product'),
      quantitySold: toNumber(product.quantity_sold ?? product.quantitySold ?? product.order_items_count),
      revenue: toNumber(product.revenue ?? product.total_revenue ?? product.order_items_sum_total),
      image: product.image ?? product.primary_image ?? undefined,
    }));

    return { topProducts };
  }

  async getCustomersReport(params: GetCustomersReportParams): Promise<CustomersReportData> {
    const response = await apiClient.get<any>(API_ENDPOINTS.REPORTS.CUSTOMERS, {
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
      },
    });
    const payload = response.data ?? {};
    const topCustomers = toArray<any>(payload.top_customers ?? payload.topCustomers).map((customer) => ({
      id: String(customer.id ?? ''),
      name: String(customer.name ?? 'Unknown customer'),
      email: String(customer.email ?? ''),
      totalOrders: toNumber(customer.total_orders ?? customer.totalOrders ?? customer.orders_count),
      totalSpent: toNumber(customer.total_spent ?? customer.totalSpent ?? customer.orders_sum_total),
    }));
    const newCustomers = toArray<any>(payload.new_customers ?? payload.newCustomers).map((customer) => ({
      id: String(customer.id ?? ''),
      name: String(customer.name ?? 'Unknown customer'),
      email: String(customer.email ?? ''),
      registrationDate: String(customer.registration_date ?? customer.registrationDate ?? customer.created_at ?? ''),
      firstOrderDate: customer.first_order_date ?? customer.firstOrderDate ?? undefined,
    }));

    return {
      totalCustomers: toNumber(payload.total_customers ?? payload.totalCustomers),
      topCustomers,
      newCustomers,
    };
  }
}

export const reportService = new ReportService();
