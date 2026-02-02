import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/report.service';
import type {
  GetSalesReportParams,
  GetProductsReportParams,
  GetCustomersReportParams,
} from '../services/report.service';

const REPORT_KEYS = {
  all: ['reports'] as const,
  sales: (params: GetSalesReportParams) => [...REPORT_KEYS.all, 'sales', params] as const,
  products: (params: GetProductsReportParams) => [...REPORT_KEYS.all, 'products', params] as const,
  customers: (params: GetCustomersReportParams) => [...REPORT_KEYS.all, 'customers', params] as const,
};

export function useSalesReport(params: GetSalesReportParams, enabled = true) {
  return useQuery({
    queryKey: REPORT_KEYS.sales(params),
    queryFn: () => reportService.getSalesReport(params),
    enabled: enabled && !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsReport(params: GetProductsReportParams = {}, enabled = true) {
  return useQuery({
    queryKey: REPORT_KEYS.products(params),
    queryFn: () => reportService.getProductsReport(params),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCustomersReport(params: GetCustomersReportParams, enabled = true) {
  return useQuery({
    queryKey: REPORT_KEYS.customers(params),
    queryFn: () => reportService.getCustomersReport(params),
    enabled: enabled && !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
  });
}
