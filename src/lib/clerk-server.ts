// File only runs on the server
// using clerk backend to display user name
import { Clerk } from '@clerk/backend';

// apiKey depreciated so using secretKey
export const clerk = Clerk({
    secretKey: process.env.CLERK_SECRET_KEY,
});