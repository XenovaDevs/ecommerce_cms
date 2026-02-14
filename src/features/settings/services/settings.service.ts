import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type { SettingsData, UpdateSettingsRequest } from '../types/settings.types';

class SettingsService {
  async getSettings(): Promise<SettingsData> {
    const response = await apiClient.get<SettingsData>(API_ENDPOINTS.SETTINGS.GET);
    return response.data;
  }

  async updateSettings(data: UpdateSettingsRequest): Promise<SettingsData> {
    const response = await apiClient.put<SettingsData>(
      `${API_ENDPOINTS.SETTINGS.GET}/${data.group}`,
      data.settings
    );
    return response.data;
  }
}

export const settingsService = new SettingsService();
