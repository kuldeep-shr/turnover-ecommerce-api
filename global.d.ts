declare namespace NodeJS {
  interface ProcessEnv {
    SECRET_KEY: string;
    API_ENDPOINT: string;
    PORT: string;
    TABLE_USER: string;
    TABLE_CATEGORY: string;
    TABLE_USER_CATEGORY: string;
    PGSTRING: string;
  }
}
