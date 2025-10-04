/**
 * Rate limiter middleware to prevent abuse and brute-force attacks.
 * Limits each IP to 100 requests per 15-minute window.
 *
 * Note: Uses MemoryStore (single-process only). For production clusters,
 * configure an external store (Redis, Memcached, etc.).
 */
import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: 'draft-8', // Use IETF draft-8 standard headers
    legacyHeaders: false, // Disable deprecated X-RateLimit-* headers
});

export default rateLimiter;