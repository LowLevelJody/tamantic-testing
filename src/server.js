const express = require("express");
const router = require("./routes.js");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if it's available
const host = "0.0.0.0";

// Middleware setup
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.listen(port, host, () => {
    console.log(`Server berjalan di http://${host}:${port}`);
});