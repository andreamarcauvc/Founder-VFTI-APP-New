const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

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
app.post("/submit", (req, res) => {
    // Extract the data from the request body
    const { founderName, startupName, email, founderType, traitDescriptions, suggestion } = req.body;

    // Print the received data to the console
    console.log("User Data Received:");
    console.log(`Founder Name: ${founderName}`);
    console.log(`Startup Name: ${startupName}`);
    console.log(`Email: ${email}`);
    console.log(`Founder Type: ${founderType}`);
    console.log(`Trait Descriptions: ${traitDescriptions}`);
    console.log(`Co-Founder Suggestions: ${suggestion}`);

    // Respond to the client with success
    res.json({ result: "success" });
});

// Start the server using the appropriate port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
