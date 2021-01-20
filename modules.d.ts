declare namespace NodeJS {
  export interface ProcessEnv {
    MONGODB_URL: string
    PORT?: string | number
    JWT_SECRET: string
    SERVER_DEV_URL: string
    SERVER_PROD_URL: string
    MAIL_USER: string
    MAIL_PASSWORD: string
  }
}
