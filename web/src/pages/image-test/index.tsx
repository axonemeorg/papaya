import React, { useState } from 'react';
import PouchDB from 'pouchdb';

const db = new PouchDB('images');

const ImageUploader = () => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageResize = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxDimension = 1080;
        let width = img.width;
        let height = img.height;

        // Resize while maintaining the aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height *= maxDimension / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width *= maxDimension / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to a blob
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.8 // Quality factor (80%)
        );
      };

      img.onerror = (err) => reject(err);
      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const resizedBlob = await handleImageResize(file);

      // Store in PouchDB
      const doc = {
        _id: new Date().toISOString(),
        type: 'image',
      };

      const result = await db.put(doc);

      // Attach the resized image to the record
      await db.putAttachment(
        result.id,
        'image.jpg',
        result.rev,
        resizedBlob,
        'image/jpeg'
      );

      // Display the preview
      const url = URL.createObjectURL(resizedBlob);
      setPreview(url);
    } catch (err) {
      console.error('Error resizing or storing the image:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Image Uploader</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />
      {loading && <p>Processing...</p>}
      {preview && (
        <div>
          <h3>Preview:</h3>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};


export default function Page() {
    return (
        <div>
            <h1>Image test</h1>
            <ImageUploader />
        </div>
    )
}
