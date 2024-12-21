
export const getImageBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
            reject(new Error("Provided file is not an image."));
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
                // The base64 data will be part of the Data URL (e.g., "data:image/png;base64,...").
                const base64Data = result.split(",")[1]; // Extract only the base64 data.
                resolve(base64Data);
            } else {
                reject(new Error("FileReader result is not a string."));
            }
        };

        reader.onerror = () => {
            reject(new Error("Error occurred while reading the file."));
        };

        reader.readAsDataURL(file); // Read file as Data URL (base64 representation included).
    });
};
