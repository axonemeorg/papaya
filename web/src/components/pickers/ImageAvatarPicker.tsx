'use client';

import { useUserImageAvatarHistoryStore } from "@/store/useUserImageUploadStore";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { useState } from "react";


export default function ImageAvatarPicker() {
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const history = useUserImageAvatarHistoryStore((state) => state.history);

    console.log('history:', history)

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            setError(null);

            try {
                const formData = new FormData();
                formData.append('file', file);

                console.log('the file:', file)

                // Send the file to your API endpoint
                const response = await fetch('/api/images/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                console.log('data:', data)
                console.log('process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_IMAGES_URL:', process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_IMAGES_URL)
                
                setImageSrc([
                    process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_IMAGES_URL,
                    data.s3Key
                ].join('/'));

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
                    // style={{ display: 'none' }}
                />
                {/* <button
                    // loading={uploading}
                >
                    Choose File
                </button> */}
            </label>
            {imageSrc && <img src={`https://${imageSrc}`} alt="Image avatar" />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Box>
    );
};
