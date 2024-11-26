import { AddPhotoAlternate } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { createContext, PropsWithChildren, useContext, useRef, useState } from "react";

interface AttachmentDropzoneProps extends PropsWithChildren {
    onFilesAdded: (files: File[]) => void;
    allowMultiple?: boolean;
}

interface AttachmentContext {
    onClickUpload: () => void;
}

const AttachmentContext = createContext<AttachmentContext>({
    onClickUpload: () => {},
});

export const AttachmentDropzone = (props: AttachmentDropzoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const onClickUpload = () => {
        fileInputRef?.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onFilesAdded(Array.from(event.target.files ?? []));
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const files = Array.from(event.dataTransfer.files);
        if (files.length > 0) {
            props.onFilesAdded(files);
        }
    };

    return (
        <AttachmentContext.Provider value={{ onClickUpload }}>
            <input
                type="file"
                onChange={handleFileChange}
                multiple={props.allowMultiple}
                style={{ display: "none" }}
                ref={fileInputRef}
            />
            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ position: "relative", width: "100%", height: "100%" }}
            >
                {isDragging && (
                    <Box
                        sx={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            position: "absolute",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "2px dashed white",
                            zIndex: 10,
                        }}
                    >
                        Drop your files here
                    </Box>
                )}
                {props.children}
            </div>
        </AttachmentContext.Provider>
    );
};

interface AttachmentButtonProps {
    renderButton?: (ButtonsProps: { onClick: () => void }) => React.ReactNode;
}

export const AttachmentButton = (props: AttachmentButtonProps) => {
    const { onClickUpload } = useContext(AttachmentContext);

    if (props.renderButton) {
        return props.renderButton({ onClick: onClickUpload });
    }

    return (
        <Button onClick={onClickUpload} startIcon={<AddPhotoAlternate />}>
            Add Attachment
        </Button>
    );
};
