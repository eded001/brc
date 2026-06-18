export const Logger = {
    info: (tag: string, message: string, data?: unknown) => {
        if (__DEV__) {
            if (data) console.log(`[INFO][${tag}] ${message}`, data);
            else console.log(`[INFO][${tag}] ${message}`);
        }
    },
    warn: (tag: string, message: string, data?: unknown) => {
        if (__DEV__) {
            if (data) console.warn(`[WARN][${tag}] ${message}`, data);
            else console.warn(`[WARN][${tag}] ${message}`);
        }
    },
    error: (tag: string, message: string, error?: unknown) => {
        if (__DEV__) {
            if (error) console.error(`[ERROR][${tag}] ${message}`, error);
            else console.error(`[ERROR][${tag}] ${message}`);
        } else {
            // Integração futura:
            // crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
        }
    }
};
