import { useState, useCallback } from 'react';
import { updateProfile, changePassword } from '../../profilePageService';

export function useEditProfileForm(profile, onSuccess) {
  const [form, setForm] = useState({
    username: profile?.username || '',
    email: profile?.email || '',
    country: profile?.country || '',
  });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [pwErrors, setPwErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const handleChange = useCallback((field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  }, []);

  const handlePwChange = useCallback((field) => (e) => {
    setPwForm((p) => ({ ...p, [field]: e.target.value }));
    setPwErrors((p) => ({ ...p, [field]: '' }));
  }, []);

  const handleSaveProfile = useCallback(async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.username) errs.username = 'Username is required.';
    if (!form.email) errs.email = 'Email is required.';
    if (!form.country) errs.country = 'Country is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    const { data, ok } = await updateProfile(form);
    if (ok) {
      setMsg('Profile updated successfully.');
      onSuccess?.(data);
    } else {
      setMsg(data?.message || 'Update failed.');
    }
    setSaving(false);
  }, [form, onSuccess]);

  const handleSavePassword = useCallback(async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.current) errs.current = 'Current password is required.';
    if (!pwForm.newPw || pwForm.newPw.length < 8) errs.newPw = 'New password must be at least 8 characters.';
    if (pwForm.newPw !== pwForm.confirm) errs.confirm = 'Passwords do not match.';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    setSavingPw(true);
    const { data, ok } = await changePassword({ currentPassword: pwForm.current, newPassword: pwForm.newPw });
    if (ok) {
      setPwMsg('Password changed successfully.');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } else {
      setPwMsg(data?.message || 'Password change failed.');
    }
    setSavingPw(false);
  }, [pwForm]);

  return {
    form, errors, saving, msg, handleChange, handleSaveProfile,
    pwForm, pwErrors, savingPw, pwMsg, handlePwChange, handleSavePassword,
  };
}
