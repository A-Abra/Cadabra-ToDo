/** @type {import('next').NextConfig} */
const nextConfig = {
    /* DEPRECIATED
        images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
        {
        protocol: "https",
        hostname: "**",
        },
    ],
    }
    */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                // only firebasestorage links in db
                hostname: 'firebasestorage.googleapis.com',
                pathname: '**',
            },
        ],
    },
    // for vercel deployment
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig
