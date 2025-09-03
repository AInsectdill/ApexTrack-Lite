import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Upload, Download } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    favicon_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentVersion, setCurrentVersion] = useState('1.2.4');
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    loadSettings();
    checkForUpdates();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/settings.json');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const checkForUpdates = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/apextrack/ApexTrack-Lite/master/version.txt');
      if (response.ok) {
        const latestVersion = await response.text();
        const latest = latestVersion.trim();
        if (latest !== currentVersion) {
          setUpdateAvailable(true);
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', msg: string) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you'd save this to your backend
      showMessage('success', 'Settings saved successfully!');
    } catch (err: any) {
      showMessage('error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    showMessage('success', 'Update started. This may take a few minutes...');
    
    try {
      // In a real app, you'd trigger the update process
      setTimeout(() => {
        showMessage('success', 'Update completed successfully!');
        setUpdateAvailable(false);
        setLoading(false);
      }, 3000);
    } catch (err: any) {
      showMessage('error', 'Update failed');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Website Settings</h1>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {/* Website Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <SettingsIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Website Configuration</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter website name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Favicon (.ico)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input type="file" accept=".ico" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">ICO files only, up to 2MB</p>
                </div>
              </div>
              {settings.favicon_url && (
                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Current favicon:</span>
                  <img src={settings.favicon_url} alt="Current favicon" className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Version & Updates */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Download className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Application Version</h2>
          </div>

          <div className="text-center space-y-4">
            <div>
              <p className="text-lg font-semibold text-gray-900">Current Version: {currentVersion}</p>
              {updateAvailable ? (
                <div className="mt-4">
                  <p className="text-green-600 font-semibold mb-4">New version available!</p>
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center space-x-2 mx-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>{loading ? 'Updating...' : 'Update Now'}</span>
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">You are using the latest version.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;