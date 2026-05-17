import React from 'react';
import { useEditProfileForm } from './useEditProfileForm';
import Input from '../../../../../components/Input/Input';
import Button from '../../../../../components/Button/Button';
import CountrySelect from '../../../../../components/CountrySelect/CountrySelect';
import './EditProfileForm.css';

function EditProfileForm({ profile, onSuccess }) {
  const {
    form, errors, saving, msg, handleChange, handleSaveProfile,
    pwForm, pwErrors, savingPw, pwMsg, handlePwChange, handleSavePassword,
  } = useEditProfileForm(profile, onSuccess);

  return (
    <div className="edit-profile-form">
      <section className="edit-profile-form__section">
        <h3 className="edit-profile-form__section-title">Contact Information</h3>
        {msg && <div className="edit-profile-form__msg">{msg}</div>}
        <form onSubmit={handleSaveProfile} noValidate>
          <div className="edit-profile-form__fields">
            <Input
              id="ep-username"
              label="Username"
              value={form.username}
              onChange={handleChange('username')}
              error={errors.username}
              required
            />
            <Input
              id="ep-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              required
            />
            <div className="edit-profile-form__field-group">
              <label className="edit-profile-form__label" htmlFor="ep-country">Country *</label>
              <CountrySelect
                id="ep-country"
                value={form.country}
                onChange={handleChange('country')}
                error={errors.country}
              />
            </div>
          </div>
          <Button type="submit" loading={saving} className="edit-profile-form__save-btn">
            Save Changes
          </Button>
        </form>
      </section>

      <section className="edit-profile-form__section">
        <h3 className="edit-profile-form__section-title">Change Password</h3>
        {pwMsg && <div className="edit-profile-form__msg">{pwMsg}</div>}
        <form onSubmit={handleSavePassword} noValidate>
          <div className="edit-profile-form__fields">
            <Input
              id="ep-cur-pw"
              label="Current Password"
              type="password"
              value={pwForm.current}
              onChange={handlePwChange('current')}
              error={pwErrors.current}
              autoComplete="current-password"
            />
            <Input
              id="ep-new-pw"
              label="New Password"
              type="password"
              value={pwForm.newPw}
              onChange={handlePwChange('newPw')}
              error={pwErrors.newPw}
              autoComplete="new-password"
            />
            <Input
              id="ep-confirm-pw"
              label="Confirm New Password"
              type="password"
              value={pwForm.confirm}
              onChange={handlePwChange('confirm')}
              error={pwErrors.confirm}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" loading={savingPw} className="edit-profile-form__save-btn">
            Change Password
          </Button>
        </form>
      </section>
    </div>
  );
}

export default EditProfileForm;
