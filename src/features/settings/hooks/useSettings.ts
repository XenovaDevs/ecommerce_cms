import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';

const SETTINGS_KEYS = {
  all: ['settings'] as const,
  detail: () => [...SETTINGS_KEYS.all, 'detail'] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEYS.detail(),
    queryFn: () => settingsService.getSettings(),
    staleTime: 10 * 60 * 1000,
  });
}
