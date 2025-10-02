import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function ensureTableExists() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS readings (
        id VARCHAR(36) PRIMARY KEY,
        date DATE NOT NULL,
        value double NOT NULL,
        UNIQUE(date)
      );
    `);
    connection.release();
    console.log("Table 'readings' is ready.");
  } catch (error) {
    console.error("Error ensuring 'readingss' table exists:", error);
    process.exit(1);
  }
}

ensureTableExists();

export default pool;
