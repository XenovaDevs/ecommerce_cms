import { apiClient } from '@/lib/api-client';
import type { SettingsData, UpdateSettingsRequest } from '../types/settings.types';

class SettingsService {
  private readonly basePath = '/settings';

  async getSettings(): Promise<SettingsData> {
    const response = await apiClient.get<SettingsData>(this.basePath);
    return response.data;
  }

  async updateSettings(data: UpdateSettingsRequest): Promise<SettingsData> {
    const response = await apiClient.put<SettingsData>(
      `${this.basePath}/${data.group}`,
      data.settings
    );
    return response.data;
  }
}

export const settingsService = new SettingsService();
