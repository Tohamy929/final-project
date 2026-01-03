import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce.routemisr.com',
        port: '',
        pathname: '/**', // simplified pattern
      },
    ],
  },

  // If you want to run in server mode (not static export)
  output: 'standalone',
}

export default config