import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/api.js';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(user);
      setFormData({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        suffix: user.suffix || '',
        email: user.email || ''
      });
    }
    setLoading(false);
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('First name and last name are required');
      return;
    }

    setUpdating(true);
    try {
      const { data } = await api.put('/users/profile', formData);
      setProfile(data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setUpdating(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
          <p className="mt-4 text-sm text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const inputClasses = 'w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-primary focus:outline-none touch-manipulation sm:rounded-2xl';

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-white sm:text-3xl">Account Settings</h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">Manage your profile and preferences</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-95 touch-manipulation sm:rounded-2xl sm:px-6 sm:text-sm"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-white/5 bg-[#15161b]/95 p-4 shadow-lg sm:rounded-3xl sm:p-6">
            <div className="text-center">
              {profile?.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="mx-auto h-20 w-20 rounded-full border-4 border-primary/30 object-cover sm:h-24 sm:w-24"
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10 sm:h-24 sm:w-24">
                  <span className="text-xl font-bold text-primary sm:text-2xl">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </span>
                </div>
              )}
              <h2 className="mt-3 font-heading text-lg text-white sm:mt-4 sm:text-xl">{profile?.name}</h2>
              <p className="text-xs text-slate-400 sm:text-sm">{profile?.email}</p>
              <div className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {profile?.role}
              </div>
            </div>

            <div className="mt-5 space-y-2.5 border-t border-white/5 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 sm:text-sm">Status</span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-green-400 sm:text-sm">
                    {profile?.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 sm:text-sm">Member since</span>
                <span className="text-xs font-semibold text-white sm:text-sm">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 sm:text-sm">Last login</span>
                <span className="text-xs font-semibold text-white sm:text-sm">
                  {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-5 w-full rounded-xl bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 active:scale-95 touch-manipulation sm:rounded-2xl sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* Profile Edit Form */}
          <div className="rounded-2xl border border-white/5 bg-[#15161b]/95 p-4 shadow-lg sm:rounded-3xl sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h3 className="font-heading text-lg text-white sm:text-xl">Personal Information</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20 active:scale-95 touch-manipulation sm:px-4 sm:py-2 sm:text-sm"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <label className="space-y-1.5">
                    <span className="text-xs text-slate-300 sm:text-sm">First name</span>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={inputClasses}
                      placeholder="First name"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs text-slate-300 sm:text-sm">Middle name (optional)</span>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                      className={inputClasses}
                      placeholder="Middle name"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs text-slate-300 sm:text-sm">Last name</span>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={inputClasses}
                      placeholder="Last name"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs text-slate-300 sm:text-sm">Suffix (optional)</span>
                    <input
                      type="text"
                      value={formData.suffix}
                      onChange={(e) => handleInputChange('suffix', e.target.value)}
                      className={inputClasses}
                      placeholder="Jr., Sr., PE"
                    />
                  </label>
                </div>

                <label className="space-y-1.5">
                  <span className="text-xs text-slate-300 sm:text-sm">Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-sm text-slate-500 cursor-not-allowed sm:rounded-2xl"
                  />
                  <p className="text-[0.65rem] text-slate-500">Email cannot be changed</p>
                </label>

                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="w-full rounded-xl bg-primary py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-primary/90 disabled:opacity-50 active:scale-95 touch-manipulation sm:rounded-2xl sm:text-sm"
                >
                  {updating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="rounded-xl bg-white/5 p-3 sm:p-4">
                    <p className="text-xs text-slate-400">First name</p>
                    <p className="mt-1 text-sm text-white sm:text-base">{formData.firstName}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 sm:p-4">
                    <p className="text-xs text-slate-400">Middle name</p>
                    <p className="mt-1 text-sm text-white sm:text-base">{formData.middleName || '—'}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 sm:p-4">
                    <p className="text-xs text-slate-400">Last name</p>
                    <p className="mt-1 text-sm text-white sm:text-base">{formData.lastName}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 sm:p-4">
                    <p className="text-xs text-slate-400">Suffix</p>
                    <p className="mt-1 text-sm text-white sm:text-base">{formData.suffix || '—'}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 p-3 sm:p-4">
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="mt-1 text-sm text-white sm:text-base">{formData.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="rounded-2xl border border-white/5 bg-[#15161b]/95 p-4 shadow-lg sm:rounded-3xl sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h3 className="font-heading text-lg text-white sm:text-xl">Security</h3>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20 active:scale-95 touch-manipulation sm:px-4 sm:py-2 sm:text-sm"
              >
                {showPasswordForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordForm ? (
              <div className="space-y-3 sm:space-y-4">
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-300 sm:text-sm">Current password</span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className={inputClasses}
                    placeholder="Enter current password"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-300 sm:text-sm">New password</span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={inputClasses}
                    placeholder="Enter new password"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs text-slate-300 sm:text-sm">Confirm new password</span>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={inputClasses}
                    placeholder="Confirm new password"
                  />
                </label>
                <button
                  onClick={handleChangePassword}
                  disabled={updating}
                  className="w-full rounded-xl bg-primary py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-primary/90 disabled:opacity-50 active:scale-95 touch-manipulation sm:rounded-2xl sm:text-sm"
                >
                  {updating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Updating...
                    </span>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs text-slate-400 sm:text-sm">
                  Keep your account secure by using a strong, unique password. We recommend changing it periodically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
