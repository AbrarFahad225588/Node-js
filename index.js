require('dotenv').config();
const http = require("node:http");
const fs = require("node:fs");
const url = require("url");
const express = require("express");
const db = require("./db");
const { User } = require("./models/user");

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    log = `${Date.now()}:${req?.url} new request received \n`;
    fs.appendFile("log.txt", log, (err, data) => {
        next();
    })
})

// Automatically create the users table if it does not exist (runs silently if it exists)
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
initDb();

// HTML View: GET all users from database
app.get('/users', async (req, res) => {
    try {
        const rows = await User.getAll();
        const html = `
        <ul>
        ${rows.map(user => `<li>${user.first_name} - ${user.email}</li>`).join('')}
        </ul>
        `;
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// JSON API: GET all users from database
app.get('/api/users', async (req, res) => {
    try {
        const rows = await User.getAll();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// JSON API: GET single user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const user = await User.getById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// JSON API: POST to create a new user (with Zod Validation)
app.post('/api/users', async (req, res) => {
    // Validate request body against our schema
    const validationResult = User.validate(req.body);
    
    if (!validationResult.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: validationResult.error.flatten().fieldErrors
        });
    }

    try {
        const insertId = await User.create(validationResult.data);
        res.status(201).json({
            message: 'User created successfully',
            userId: insertId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});
app.get('/about', (req, res) => {
    res.send("about")
})
app.get('/contact', (req, res) => {
    res.send("contact")
})
app.get('/end', (req, res) => {
    res.send("end")
})
app.get('/{*path}', (req, res) => {
    res.send("404 not found")
})
app.post("/form", (req, res) => {
    res.end("form submitted")
})
const PORT = process.env.PORT || 8000;
app.listen(PORT, (err) => {
    if (err) {
        console.error("Failed to start server:", err);
        return;
    }
    console.log(`start server`);
    console.log(` click http://localhost:${PORT}/`)
})


const hanndler = (req, res) => {
    if (req.url === '/favicon.ico') { res.end() };
    const myUrl = url.parse(req.url, true);
    const log = `${Date.now()}:${req?.url} new request received \n`;
    console.log(myUrl)
    fs.appendFile("log.txt", log, (err, data) => {
        switch (myUrl.pathname) {
            case "/":
                res.end("this is home page")
                break;
            case "/about":
                const search = myUrl.query.search_query;
                res.end(`this is abput page ${search}`)
                break;
            case "/contact":
                res.end("this is contact page")
                break;
            case "/end":
                res.end("this is end page")
                break;
            default:
                res.end("404 not found");
                break;

        }
    })

};
// const myserver=http.createServer(hanndler);
// myServer.listen(8000,()=>{console.log(url)});