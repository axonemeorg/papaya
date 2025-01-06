

export const parseServerUrl = (url: string | null): string | null => {
    // If the URL is null, return null
    if (!url) {
        return null
    }

    // Parse the URL by adding http if it's absent, and removing trailing slashes
    const parsedUrl = new URL(url)
    return parsedUrl.toString()
}

export const prettyPrintServerUrl = (url: string | null): string => {
    // If the URL is null, return an empty string
    if (!url) {
        return ''
    }

    // Parse the URL and return the hostname
    const parsedUrl = new URL(url)
    return parsedUrl.hostname
}

export const getServerApiUrl = (url: string | null): string | null => {
    // If the URL is null, return null
    if (!url) {
        return null
    }

    // Parse the URL and return the API URL
    const parsedUrl = new URL(url)
    return `${parsedUrl.origin}/api`
}

export const getServerDatabaseUrl = (url: string | null): string | null => {
    // If the URL is null, return null
    if (!url) {
        return null
    }

    // Parse the URL and return the database URL
    const parsedUrl = new URL(url)
    return `${parsedUrl.origin}/database`
}
