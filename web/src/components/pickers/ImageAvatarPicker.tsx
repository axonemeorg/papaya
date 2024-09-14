'use client';

import { AvatarVariant } from "@/types/enum";
import { ItemAvatar } from "@/types/get";
import { AddPhotoAlternate, Photo, RemoveCircle } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Box, Button, FormHelperText, Stack } from "@mui/material";
import { useMemo, useRef, useState } from "react";

interface ImageAvatarPicker {
    value: ItemAvatar;
    onChange: (avatar: ItemAvatar) => void;
}

export default function ImageAvatarPicker(props: ImageAvatarPicker) {
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef(null);

    const handleImageUploadSuccess = (data) => {
        props.onChange({
            avatarContent: data.s3Key,
            avatarVariant: AvatarVariant.Enum.IMAGE,
            avatarPrimaryColor: '',
        })
    }

    const hasImageIcon = useMemo(() => {
        return [
            Boolean(props.value),
            Boolean(props.value?.avatarContent),
            props.value?.avatarVariant === AvatarVariant.Enum.IMAGE,
        ].every(Boolean);
    }, [props.value]);

    const currentImageSrc: string | null = useMemo(() => {
        if (hasImageIcon) {
            return [
                'https:/',
                process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_IMAGES_URL,
                props.value.avatarContent
            ].join('/');
        }

        return null;
    }, [props.value, hasImageIcon]);

    const handleRemoveImage = () => {
        props.onChange(null);
    }

    const handleClickUploadButton = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            setUploadError(null);

            try {
                const formData = new FormData();
                formData.append('file', file);

                // Send the file to your API endpoint
                const response = await fetch('/api/images/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                handleImageUploadSuccess(data);
            } catch (err) {
                setUploadError((err as Error).message);
            } finally {
                setUploading(false);
            }
        }
    }

    return (
        <Box p={2}>
            <input
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <Stack direction='row' sx={{ mb: 1 }} gap={2}>
                {currentImageSrc && (
                    <>
                        <Avatar
                            variant="rounded"
                            src={currentImageSrc}
                            sx={uploading ? {
                                filter: 'blur(2px)',
                                opacity: 0.5,
                            } : undefined}
                        />
                        <Button
                            variant='text'
                            onClick={() => handleRemoveImage()}
                            startIcon={<RemoveCircle />}
                        >
                            Remove
                        </Button>
                    </>
                )}
                <LoadingButton
                    onClick={handleClickUploadButton}
                    loading={uploading}
                    startIcon={<AddPhotoAlternate />}
                >
                    {hasImageIcon ? 'Replace Image' : 'Add Image'}
                </LoadingButton>
            </Stack>            
            {uploadError && (
                <FormHelperText error>{uploadError}</FormHelperText>
            )}
        </Box>
    );
};
