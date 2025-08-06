import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

// Interface for personal settings configuration
export interface PersonalSettingsConfig {
  profilePicture: string;
  name: string;
  dob: string;
}

export type PersonalSettingsStorage = BaseStorage<PersonalSettingsConfig> & {
  updateSettings: (settings: Partial<PersonalSettingsConfig>) => Promise<void>;
  getSettings: () => Promise<PersonalSettingsConfig>;
  resetToDefaults: () => Promise<void>;
};

// Default settings
export const DEFAULT_PERSONAL_SETTINGS: PersonalSettingsConfig = {
  profilePicture: '',
  name: '',
  dob: '',
};

const storage = createStorage<PersonalSettingsConfig>('personal-settings', DEFAULT_PERSONAL_SETTINGS, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const personalSettingsStore: PersonalSettingsStorage = {
  ...storage,
  async updateSettings(settings: Partial<PersonalSettingsConfig>) {
    const currentSettings = (await storage.get()) || DEFAULT_PERSONAL_SETTINGS;
    const updatedSettings = {
      ...currentSettings,
      ...settings,
    };
    await storage.set(updatedSettings);
  },
  async getSettings() {
    const settings = await storage.get();
    return {
      ...DEFAULT_PERSONAL_SETTINGS,
      ...settings,
    };
  },
  async resetToDefaults() {
    await storage.set(DEFAULT_PERSONAL_SETTINGS);
  },
};
