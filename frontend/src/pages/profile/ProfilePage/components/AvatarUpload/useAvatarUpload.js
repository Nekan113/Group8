import { useState, useCallback } from 'react';
import { uploadAvatar } from '../../profilePageService';

export function useAvatarUpload(onSuccess) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = useCallback((e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (selected.size > 5 * 1024 * 1024) { setError('Image must be smaller than 5MB.'); return; }
    setError('');
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) { setError('Please select a file first.'); return; }
    setUploading(true);
    const { data, ok } = await uploadAvatar(file);
    if (ok) {
      onSuccess?.(data);
      setFile(null);
    } else {
      setError(data?.message || 'Upload failed.');
    }
    setUploading(false);
  }, [file, onSuccess]);

  const clearPreview = useCallback(() => {
    setPreview(null);
    setFile(null);
    setError('');
  }, []);

  return { preview, error, uploading, handleFileChange, handleUpload, clearPreview };
}
