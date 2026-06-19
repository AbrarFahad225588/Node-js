require('dotenv').config();
const mysql = require('mysql2');

// Create the connection pool. Use environment variables in production!
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',             // Your MySQL username
  password: process.env.DB_PASSWORD,               // Your MySQL password
  database: process.env.DB_NAME,                   // Your Database name
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Export the promise-based pool for async/await support
module.exports = pool.promise();
