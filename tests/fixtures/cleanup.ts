import { API_ENDPOINTS } from '../../src/services/apiEndpoints';
import type { ApiClient } from '../utils/api-client';

export class CleanupRegistry {
  private productIds = new Set<number>();
  private categoryIds = new Set<number>();

  registerProduct(id: number | null | undefined): void {
    if (typeof id === 'number') {
      this.productIds.add(id);
    }
  }

  registerCategory(id: number | null | undefined): void {
    if (typeof id === 'number') {
      this.categoryIds.add(id);
    }
  }

  async run(api: ApiClient): Promise<void> {
    for (const id of [...this.productIds].reverse()) {
      await api.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    }

    for (const id of [...this.categoryIds].reverse()) {
      await api.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
    }
  }
}
