import { AddPhotoAlternate } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { createContext, PropsWithChildren, useContext, useRef } from "react";

interface AttachmentDropzoneProps extends PropsWithChildren {
    onFilesAdded: (files: File[]) => void;
    allowMultiple?: boolean;
}

interface AttachmentContext {
    onClickUpload: () => void;
}

const AttachmentContext = createContext<AttachmentContext>({
    onClickUpload: () => {}
});

export const AttachmentDropzone = (props: AttachmentDropzoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onClickUpload = () => {
        fileInputRef?.current?.click();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onFilesAdded(Array.from(event.target.files ?? []));
    }

    return (
        <AttachmentContext.Provider value={{ onClickUpload }}>
             <input
                type="file"
                onChange={handleFileChange}
                multiple={props.allowMultiple}
                style={{ display: 'none' }}
                ref={fileInputRef}
            /> 
            <Box
                sx={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '2px dashed white',
                }}
            />
            {props.children}
        </AttachmentContext.Provider>
    )
}

interface AttachmentButtonProps {
    renderButton?: (ButtonsProps: { onClick: () => void }) => React.ReactNode;
}

export const AttachmentButton = (props: AttachmentButtonProps) => {
    const { onClickUpload } = useContext(AttachmentContext);

    if (props.renderButton) {
        return props.renderButton({ onClick: onClickUpload })
    }

    return (
        <Button
            onClick={onClickUpload}
            startIcon={<AddPhotoAlternate />}
        >
            Add Attachment
        </Button>
    );
}
