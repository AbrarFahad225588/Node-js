const db = require("./db");
async function initDb() {
    try {
        const [rows] = await db.query("SHOW TABLES LIKE 'users'");
        if (rows.length === 0) {
            await db.query(`
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(100),
                    last_name VARCHAR(100),
                    email VARCHAR(100) UNIQUE,
                    gender VARCHAR(50),
                    user VARCHAR(100)
                )
            `);
            console.log("Database table 'users' created successfully.");
        }
    } catch (err) {
        console.error("Database table initialization failed:", err);
    }
}

module.exports = {
    initDb
};