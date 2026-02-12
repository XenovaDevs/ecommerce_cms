import { apiClient } from '@/services/api';
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

class ReportService {
  private readonly basePath = '/reports';

  async getSalesReport(params: GetSalesReportParams): Promise<SalesReportData> {
    const response = await apiClient.get<SalesReportData>(`${this.basePath}/sales`, {
      params,
    });
    return response.data;
  }

  async getProductsReport(params: GetProductsReportParams = {}): Promise<ProductsReportData> {
    const response = await apiClient.get<ProductsReportData>(`${this.basePath}/products`, {
      params: {
        limit: params.limit ?? 10,
      },
    });
    return response.data;
  }

  async getCustomersReport(params: GetCustomersReportParams): Promise<CustomersReportData> {
    const response = await apiClient.get<CustomersReportData>(`${this.basePath}/customers`, {
      params,
    });
    return response.data;
  }
}

export const reportService = new ReportService();
