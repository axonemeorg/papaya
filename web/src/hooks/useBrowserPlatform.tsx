import { useMemo } from "react";

interface UseBrowserPlatform {
    macOs: boolean;
}

export default function useBrowserPlatform(): UseBrowserPlatform {
    const macOs = useMemo(() => {
        return navigator.platform.toUpperCase().startsWith('MAC')
    }, [])

    return {
        macOs
    }
}
