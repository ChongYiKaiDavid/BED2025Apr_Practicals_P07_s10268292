const sql = require("mssql");
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || "booksapi_user",
  password: process.env.DB_PASSWORD || "password123",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_DATABASE || "bed_db",
  trustServerCertificate: true,
  options: {
    port: parseInt(process.env.DB_PORT) || 1433,
    connectionTimeout: 60000,
  },
};

let poolPromise;

const getConnection = async () => {
  try {
    if (!poolPromise) {
      poolPromise = new sql.ConnectionPool(dbConfig).connect();
    }
    return await poolPromise;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

const closeConnection = async () => {
  try {
    if (poolPromise) {
      const pool = await poolPromise;
      await pool.close();
      poolPromise = null;
    }
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
};

module.exports = {
  sql,
  getConnection,
  closeConnection,
};
