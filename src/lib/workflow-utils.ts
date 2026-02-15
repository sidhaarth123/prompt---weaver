import crypto from "crypto";

/**
 * Generate HMAC signature for n8n webhook security
 */
export function generateHMACSignature(payload: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verify HMAC signature
 */
export function verifyHMACSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    const expected = generateHMACSignature(payload, secret);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

/**
 * Exponential backoff retry utility
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;

            // Only retry on transient errors
            const isTransient =
                error.status === 502 ||
                error.status === 503 ||
                error.status === 504 ||
                error.code === "ETIMEDOUT" ||
                error.code === "ECONNREFUSED";

            if (!isTransient || attempt === maxRetries - 1) {
                throw error;
            }

            // Exponential backoff
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

/**
 * Create timeout promise for Promise.race
 */
export function createTimeoutPromise(ms: number, message?: string): Promise<never> {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error(message || `Timeout after ${ms}ms`)), ms)
    );
}
