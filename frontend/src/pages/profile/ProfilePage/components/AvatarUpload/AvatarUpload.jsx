import React from 'react';
import { useAvatarUpload } from './useAvatarUpload';
import Button from '../../../../../components/Button/Button';
import './AvatarUpload.css';

function AvatarUpload({ currentAvatar, onSuccess }) {
  const { preview, error, uploading, handleFileChange, handleUpload, clearPreview } = useAvatarUpload(onSuccess);

  return (
    <div className="avatar-upload">
      <div className="avatar-upload__preview-area">
        <img
          src={preview || currentAvatar || '/default-avatar.png'}
          alt="Avatar preview"
          className="avatar-upload__img"
        />
        {preview && (
          <button className="avatar-upload__clear" onClick={clearPreview} aria-label="Remove selection">✕</button>
        )}
      </div>

      <div className="avatar-upload__controls">
        <label className="avatar-upload__file-label" htmlFor="avatar-input">
          Choose Image
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="avatar-upload__file-input"
          />
        </label>

        {preview && (
          <Button onClick={handleUpload} loading={uploading} size="sm">
            Upload
          </Button>
        )}
      </div>

      {error && <p className="avatar-upload__error">{error}</p>}
      <p className="avatar-upload__hint">JPG or PNG, max 5MB. Image will be resized automatically.</p>
    </div>
  );
}

export default AvatarUpload;
