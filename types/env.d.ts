declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_HOST: string;
            DOMAIN_URL: string;
            NAVER_CLIENT_ID: string;
            NAVER_CLIENT_SECRET: string;
        }
    }
}

export {}