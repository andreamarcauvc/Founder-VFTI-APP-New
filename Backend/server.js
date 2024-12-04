const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const fs = require('fs');


const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies, serve static files, and handle CORS
app.use(bodyParser.json()); // To parse JSON request bodies
app.use(cors()); // Allow cross-origin requests from the front-end (Netlify)

// Serve the static files from the "Public" directory
app.use(express.static(path.join(__dirname, "../Public")));

// Serve the index.html file on root URL access
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public/index.html"));
});

// Endpoint to handle the form submission
app.post('/submit', (req, res) => {
    const { founderName, startupName, email, founderType, traitDescriptions, suggestion } = req.body;

    // Create a new entry to save
    const entry = {
        founderName,
        startupName,
        email,
        founderType,
        traitDescriptions,
        suggestion,
        timestamp: new Date()
    };

    // Read existing data (or create a new empty file if it doesn't exist)
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading data file:', err);
            return res.status(500).send({ result: 'error', error: 'Error reading data file' });
        }

        // Parse the data and add the new entry
        const jsonData = data ? JSON.parse(data) : [];
        jsonData.push(entry);

        // Write back to the data file
        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing data file:', err);
                return res.status(500).send({ result: 'error', error: 'Error writing data file' });
            }
            res.send({ result: 'success' });
        });
    });
});
// Start the server using the appropriate port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
