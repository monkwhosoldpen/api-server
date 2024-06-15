import { NextResponse } from "next/server";

export function middleware(req) {
    // List of allowed origins
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://www.netaconnect.com',
        'https://api.netaconnect.com',
    ];

    // Check the Origin header against the allowed origins
    const origin = req.headers.get('origin');
    const response = NextResponse.next();

    if (allowedOrigins.includes(origin)) {
        // Set CORS headers for allowed origins directly on the response
        response.headers.set('Access-Control-Allow-Credentials', 'true'); // Use string 'true'
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Vary', 'Origin'); // Ensure proper handling of the Origin header by caches

        // Set other CORS headers only if the origin is allowed
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    }
    return response;
}

// Specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/:path*',
};
