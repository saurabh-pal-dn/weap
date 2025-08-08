import { useState, useEffect } from 'react';
import { type PersonalSettingsConfig, personalSettingsStore, DEFAULT_PERSONAL_SETTINGS } from '@extension/storage';

interface PersonalSettingsProps {
  isDarkMode?: boolean;
}

export const PersonalSettings = ({ isDarkMode = false }: PersonalSettingsProps) => {
  const [settings, setSettings] = useState<PersonalSettingsConfig>(DEFAULT_PERSONAL_SETTINGS);

  useEffect(() => {
    // Load initial settings
    personalSettingsStore.getSettings().then(setSettings);
  }, []);

  const updateSetting = async <K extends keyof PersonalSettingsConfig>(key: K, value: PersonalSettingsConfig[K]) => {
    // Optimistically update the local state for responsiveness
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));
    // Call the store to update the setting
    await personalSettingsStore.updateSettings({
      [key]: value,
      isShownAready: true,
    } as Partial<PersonalSettingsConfig>);
    // After the store update, fetch the latest settings from the store and update the local state again to ensure UI consistency.
    const latestSettings = await personalSettingsStore.getSettings();
    setSettings(latestSettings);
  };

  return (
    <section className="space-y-6">
      <div
        className={`rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-white'} p-6 text-left shadow-sm`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {settings.name ?? 'Personal'}
          </h2>
          {settings.profilePicture && (
            <img src={settings.profilePicture} alt="Profile" className="size-10 rounded-full object-cover" />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Profile Picture
              </h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Upload your profile picture
              </p>
            </div>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = event => {
                    if (event.target && typeof event.target.result === 'string') {
                      updateSetting('profilePicture', event.target.result);
                    }
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
              className={`w-40 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter your name</p>
            </div>
            <input
              id="name"
              type="text"
              value={settings.name}
              onChange={e => updateSetting('name', e.target.value)}
              className={`w-40 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Date of Birth
              </h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter your date of birth
              </p>
            </div>
            <input
              id="dob"
              type="date"
              value={settings.dob}
              onChange={e => updateSetting('dob', e.target.value)}
              className={`w-40 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2`}
            />
          </div>
          <p className={`text-xs font-normal italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            These settings needs to be done only once. Once done, you can open a new tab and get on with your work
          </p>
        </div>
      </div>
    </section>
  );
};
