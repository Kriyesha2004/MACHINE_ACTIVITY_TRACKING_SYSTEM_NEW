import React, { useState } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { PageHeader, FormInput, FormSelect, ConfirmationModal } from '../../components/shared';

interface SystemSettings {
  systemName: string;
  maintenanceReminder: string;
  reportFrequency: string;
  emailNotifications: boolean;
  maxUsersAllowed: number;
  backupInterval: string;
}

export const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: 'Machine Activity Tracking System',
    maintenanceReminder: '7',
    reportFrequency: 'monthly',
    emailNotifications: true,
    maxUsersAllowed: 50,
    backupInterval: 'daily',
  });
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (hasChanges) {
      setShowSaveConfirm(true);
    }
  };

  const handleConfirmSave = () => {
    console.log('Settings saved:', settings);
    setShowSaveConfirm(false);
    setHasChanges(false);
  };

  return (
    <div className="w-full p-6">
      <PageHeader title="System Settings" subtitle="Configure application-wide settings and preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* General Settings */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Settings
              </h3>

              <FormInput
                label="System Name"
                placeholder="Enter system name"
                value={settings.systemName}
                onChange={(e) => handleChange('systemName', e.target.value)}
              />

              <FormInput
                label="Max Allowed Users"
                type="number"
                placeholder="50"
                value={settings.maxUsersAllowed}
                onChange={(e) => handleChange('maxUsersAllowed', parseInt(e.target.value))}
              />
            </div>

            {/* Notification Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Notification Settings</h3>

              <FormInput
                label="Maintenance Reminder (Days Before)"
                type="number"
                placeholder="7"
                value={settings.maintenanceReminder}
                onChange={(e) => handleChange('maintenanceReminder', e.target.value)}
                helperText="How many days before maintenance to send a reminder"
              />

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Email Notifications</span>
                </label>
              </div>
            </div>

            {/* Report Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Report Settings</h3>

              <FormSelect
                label="Report Generation Frequency"
                options={[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'yearly', label: 'Yearly' },
                ]}
                value={settings.reportFrequency}
                onChange={(e) => handleChange('reportFrequency', e.target.value)}
              />

              <FormSelect
                label="Backup Interval"
                options={[
                  { value: 'hourly', label: 'Hourly' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
                value={settings.backupInterval}
                onChange={(e) => handleChange('backupInterval', e.target.value)}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-semibold"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-blue-50 rounded-lg shadow-md p-6 h-fit">
          <div className="flex gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">System Information</h4>
              <p className="text-sm text-blue-800">
                Changes to system settings will affect all users and operations.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Last Updated</p>
              <p className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">System Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span className="font-semibold text-gray-800">Operational</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Version</p>
              <p className="font-semibold text-gray-800">1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showSaveConfirm}
        title="Save Settings"
        message="Are you sure you want to save these system settings?"
        type="confirm"
        confirmText="Save"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
};
