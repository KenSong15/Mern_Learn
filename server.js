const express = require("express");
const connectDB = require("./config/db");

//boot the express API
const app = express();

//connect to the mongoDB atalas
connectDB();

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000; // this will find a port to run on platform or locally run in 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
