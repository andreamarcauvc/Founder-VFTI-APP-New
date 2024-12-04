// Import dependencies
const sqlite3 = require('sqlite3').verbose();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Connect to SQLite database (this will create founderData.db if it doesn't exist)
const db = new sqlite3.Database('./founderData.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');

        // Create the table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS founderEntries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                founderName TEXT,
                startupName TEXT,
                email TEXT,
                founderType TEXT,
                traitDescriptions TEXT,
                suggestion TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Table "founderEntries" is ready for use');
            }
        });
    }
});

// Middleware to parse JSON bodies, serve static files, and handle CORS
app.use(bodyParser.json());
app.use(cors());

// Serve the static files from the "Public" directory
app.use(express.static(path.join(__dirname, "../Public")));

// Serve the index.html file on root URL access
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public/index.html"));
});

// Endpoint to handle the form submission
app.post('/submit', (req, res) => {
    const { founderName, startupName, email, founderType, traitDescriptions, suggestion } = req.body;

    // Insert the form data into the SQLite database
    const query = `
        INSERT INTO founderEntries (founderName, startupName, email, founderType, traitDescriptions, suggestion)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [founderName, startupName, email, founderType, traitDescriptions, suggestion], function (err) {
        if (err) {
            console.error('Error saving to SQLite database:', err);
            res.status(500).send({ result: 'error', error: 'Error saving to database' });
        } else {
            res.json({ result: 'success', id: this.lastID });
        }
    });
});

// Start the server using the appropriate port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
