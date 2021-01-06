declare namespace NodeJS {
  export interface ProcessEnv {
    MONGODB_URL: string
    PORT?: string | number
  }
}
