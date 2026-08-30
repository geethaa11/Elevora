import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Loader } from '../components/ui/Loader';
import { getSettings, updateSettings, changePassword, deleteAccount } from '../services/settingsService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Toggle = ({ checked, onChange, disabled, label }) => (
  <div className="flex items-center justify-between py-2">
    {label && <span className="text-sm font-medium text-neutral-200">{label}</span>}
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-neutral-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    email_notifications: true,
    team_notifications: true,
    hackathon_notifications: true,
    match_notifications: true,
    profile_visibility: 'public',
    show_email: false,
    show_contact: false,
    theme: 'system'
  });

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const showToast = (title, desc, variant) => {
    setToast({ title, description: desc, variant });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      showToast('Error', 'Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key, value) => {
    const originalValue = settings[key];
    setSettings(prev => ({ ...prev, [key]: value }));
    try {
      await updateSettings({ [key]: value });
      showToast('Success', 'Setting updated', 'success');
    } catch (err) {
      setSettings(prev => ({ ...prev, [key]: originalValue })); // revert
      showToast('Error', 'Failed to update setting', 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    try {
      setChangingPassword(true);
      await changePassword(passwords.currentPassword, passwords.newPassword);
      showToast('Success', 'Password updated successfully', 'success');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await deleteAccount();
      await logout();
      navigate('/login');
    } catch (err) {
      showToast('Error', err.message || 'Failed to delete account', 'error');
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-neutral-50 mb-2">Settings</h1>
        <p className="text-neutral-400 mb-8">Manage your account preferences and security.</p>

        {/* Notifications */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="space-y-4">
            <Toggle 
              label="Email Notifications" 
              checked={settings.email_notifications} 
              onChange={v => handleSettingChange('email_notifications', v)} 
            />
            <Toggle 
              label="Team Notifications" 
              checked={settings.team_notifications} 
              onChange={v => handleSettingChange('team_notifications', v)} 
            />
            <Toggle 
              label="Hackathon Notifications" 
              checked={settings.hackathon_notifications} 
              onChange={v => handleSettingChange('hackathon_notifications', v)} 
            />
            <Toggle 
              label="Match Notifications" 
              checked={settings.match_notifications} 
              onChange={v => handleSettingChange('match_notifications', v)} 
            />
          </div>
        </Card>

        {/* Privacy */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Privacy</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 py-2">
              <label className="text-sm font-medium text-neutral-200">Profile Visibility</label>
              <Select 
                value={settings.profile_visibility} 
                onChange={e => handleSettingChange('profile_visibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="connections">Connections Only</option>
              </Select>
            </div>
            <Toggle 
              label="Show Email" 
              checked={settings.show_email} 
              onChange={v => handleSettingChange('show_email', v)} 
            />
            <Toggle 
              label="Show Contact" 
              checked={settings.show_contact} 
              onChange={v => handleSettingChange('show_contact', v)} 
            />
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Appearance</h2>
          <div className="flex flex-col gap-2 py-2">
            <label className="text-sm font-medium text-neutral-200">Theme</label>
            <Select 
              value={settings.theme} 
              onChange={e => handleSettingChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </Select>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Security</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            {passwordError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {passwordError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Current Password</label>
              <PasswordInput 
                required 
                value={passwords.currentPassword}
                onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">New Password</label>
              <PasswordInput 
                required 
                value={passwords.newPassword}
                onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Confirm New Password</label>
              <PasswordInput 
                required 
                value={passwords.confirmPassword}
                onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
              />
            </div>
            <Button type="submit" isLoading={changingPassword} className="mt-2">
              Update Password
            </Button>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-500/20 bg-red-500/5">
          <h2 className="text-xl font-bold mb-2 text-red-500">Danger Zone</h2>
          <p className="text-sm text-neutral-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button 
            variant="outline" 
            className="text-red-400 border-red-400/50 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </Button>
        </Card>
      </motion.div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        title="Delete Account"
      >
        <p className="text-neutral-300 mb-6">
          Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.
        </p>
        <div className="flex justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDeleteAccount}
            isLoading={deleting}
          >
            Yes, Delete My Account
          </Button>
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-[60]">
          <Toast 
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
