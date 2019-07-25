const express = require("express");
const connectDB = require("./config/db");

//boot the express API
const app = express();

//connect to the mongoDB atalas
connectDB();

//initialize middleware
app.use(express.json({ extended: false }));

//server testing uri
app.get("/", (req, res) => res.send("API running"));

//define routes and redirect the request to each part
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000; // this will find a port to run on platform or locally run in 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
