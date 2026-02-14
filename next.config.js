/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["cdn.wheel-size.com", "llantasyrenovado.com.mx", "www.llantasyrenovado.com.mx"],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Configura esto de manera más específica según tus necesidades
            },
        ],
    }
}

module.exports = nextConfig
