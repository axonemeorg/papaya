import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { useState } from "react";


export default function ImageAvatarPicker() {
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            setError(null);

            try {
                const formData = new FormData();
                formData.append('file', file);

                // Send the file to your API endpoint
                const response = await fetch('/api/images/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                alert('File uploaded successfully!');
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setUploading(false);
            }
        }
    }

    return (
        <Box>
            <label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
                <LoadingButton loading={uploading}>
                    Choose File
                </LoadingButton>
            </label>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Box>
    );
};
