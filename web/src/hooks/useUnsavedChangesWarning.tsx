import { useEffect, useState } from 'react';

interface UseUnsavedChangesWarning {
    enableUnsavedChangesWarning: () => void;
    disableUnsavedChangesWarning: () => void;
}

export default function useUnsavedChangesWarning(enabled = false): UseUnsavedChangesWarning {
    const [isWarningEnabled, setIsWarningEnabled] = useState(enabled);

    const enableUnsavedChangesWarning = () => setIsWarningEnabled(true);
    const disableUnsavedChangesWarning = () => setIsWarningEnabled(false);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isWarningEnabled) {
                event.preventDefault();
                event.returnValue = ''; // Required for modern browsers
                return '';
            }
        };

        if (isWarningEnabled) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        } else {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }

        // Cleanup on unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isWarningEnabled]);

    return {
        enableUnsavedChangesWarning,
        disableUnsavedChangesWarning,
    };
};
