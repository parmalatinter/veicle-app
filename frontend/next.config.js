/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "standalone",
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },

    // webpack設定を追加
    webpack: (config, { dev, isServer }) => {
        // SVGR設定
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        // ホットリロードの最適化
        if (dev && !isServer) {
            config.watchOptions = {
                poll: true,
                interval: 1000,
            };
        }

        return config;
    },
};

module.exports = nextConfig;
