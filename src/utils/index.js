// Safe encode function for Unicode strings  
export const safeEncodeForBase64 = (str) => {
    try {
        // Handle Unicode characters properly
        if (typeof str !== 'string') {
            str = String(str);
        }

        // First encode to utf-8 bytes, then to base64
        const encodedBytes = unescape(encodeURIComponent(str));
        return btoa(encodedBytes);
    } catch (error) {
        console.error('Error encoding string for base64:', error);
        // Fallback: try direct base64 encoding
        try {
            return btoa(String(str));
        } catch (fallbackError) {
            console.error('Fallback encoding failed:', fallbackError);
            return '';
        }
    }
};

// Safe check for window object
export const isWindowAvailable = () => typeof window !== 'undefined';

// Helper to safely access window.google.maps
export const getGoogleMaps = () => {
    if (isWindowAvailable() && window.google?.maps) {
        return window.google.maps;
    }
    return null;
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
