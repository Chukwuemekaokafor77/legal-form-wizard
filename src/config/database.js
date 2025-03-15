// src/config/database.js
export const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'court_forms',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
  };
  