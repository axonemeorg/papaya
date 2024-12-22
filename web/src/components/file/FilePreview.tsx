import { AttachmentMeta } from "@/types/schema";
import { Folder } from "@mui/icons-material";
import { Avatar, Card, CardMedia } from "@mui/material";
import { useEffect, useState } from "react";

interface FilePreviewProps {
    meta: AttachmentMeta | undefined | null
}

export default function FilePreview(props: FilePreviewProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    console.log('FilePreview props:', props)

    useEffect(() => {
        if (!props.meta) {
            return
        }

        if (props.meta?.content_type.startsWith('image')) {
            // const objectURL = URL.createObjectURL(props.meta.data);
            setImageSrc(props.meta.data)
        }

        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc)
            }
        }
    }, [props.meta])

    return (
        <Card sx={{ aspectRatio: 4 / 5, width: 128 }}>
            {imageSrc ? (
                <CardMedia component="img" sx={{ objectFit: 'cover' }} height={'100%'} image={imageSrc} />
            ) : (
                <Avatar>
                    <Folder />
                </Avatar>
            )}
        </Card>
    )
}
