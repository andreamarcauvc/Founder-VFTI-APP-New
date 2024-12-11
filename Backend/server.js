// Import dependencies
// const sqlite3 = require('sqlite3').verbose();
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;


const uri = "mongodb+srv://andrea:iJssCWigzoUcsJxi@founderappvfti.l3c3o.mongodb.net/?retryWrites=true&w=majority&appName=FounderAppVFTI";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// Connect to SQLite database (this will create founderData.db if it doesn't exist)
// const db = new sqlite3.Database('./founderData.db', (err) => {
//     if (err) {
//         console.error('Error opening database:', err);
//     } else {
//         console.log('Connected to SQLite database');
// 
//         // Create the table if it doesn't exist
//         db.run(`
//             CREATE TABLE IF NOT EXISTS founderEntries (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 founderName TEXT,
//                 startupName TEXT,
//                 email TEXT,
//                 founderType TEXT,
//                 traitDescriptions TEXT,
//                 suggestion TEXT,
//                 timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
//             )
//         `, (err) => {
//             if (err) {
//                 console.error('Error creating table:', err);
//             } else {
//                 console.log('Table "founderEntries" is ready for use');
//             }
//         });
//     }
// });

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
// app.post('/submit', (req, res) => {
//     const { founderName, startupName, email, founderType, traitDescriptions, suggestion } = req.body;
// 
//     // Insert the form data into the SQLite database
//     const query = `
//         INSERT INTO founderEntries (founderName, startupName, email, founderType, traitDescriptions, suggestion)
//         VALUES (?, ?, ?, ?, ?, ?)
//     `;
//     db.run(query, [founderName, startupName, email, founderType, traitDescriptions, suggestion], function (err) {
//         if (err) {
//             console.error('Error saving to SQLite database:', err);
//             res.status(500).send({ result: 'error', error: 'Error saving to database' });
//         } else {
//             res.json({ result: 'success', id: this.lastID });
//         }
//     });
// });

app.post('/submit', async (req, res) => {
    const { founderName, startupName, email, founderType, traitDescriptions, suggestion } = req.body;

    try {
        // Reconnect to MongoDB (since the previous connection closes automatically)
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        const database = client.db("founderDatabase");
        const responses = database.collection("responses");

        // Prepare the document to insert
        const newResponse = {
            founderName,
            startupName,
            email,
            founderType,
            traitDescriptions,
            suggestion,
            timestamp: new Date()
        };

        // Insert the document into the "responses" collection
        const result = await responses.insertOne(newResponse);

        // Close the client connection
        await client.close();

        // Send success response
        res.json({ 
            result: 'success', 
            id: result.insertedId 
        });

    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).send({ 
            result: 'error', 
            error: 'Error saving to database' 
        });
    }
});

// Start the server using the appropriate port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
