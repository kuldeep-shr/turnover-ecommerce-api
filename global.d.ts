declare namespace NodeJS {
  interface ProcessEnv {
    SECRET_KEY: string;
    API_ENDPOINT: string;
    PORT: string;
    DB_NAME: string;
    DB_TABLE_USER: string;
    DB_TABLE_PRODUCT: string;
    DB_TABLE_CART: string;
    DB_TABLE_CART_ITEM: string;
    DB_TABLE_BOOKING: string;
    DB_TABLE_BOOKING_ITEM: string;
    PGHOST: string;
    PGDATABASE: string;
    PGUSER: string;
    PGPASSWORD: string;
    ENDPOINT_ID: string;
    PGSTRING: string;
  }
}
