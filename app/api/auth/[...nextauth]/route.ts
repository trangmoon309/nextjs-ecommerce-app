import { handlers } from '@/auth';

// This is a part of NextAuth.js setup
// It replaces the traditional export of NextAuth(req, res)
// This object has HTTP handlers for GET, POST methods
// Meaning all the auth API Calls will be directed to this file for handling the API request.
/*
    Is shorthand for handling:

    GET /api/auth/... (e.g., signout, session, csrf)

    POST /api/auth/... (e.g., signin, callback)
*/
export const { GET, POST } = handlers;
