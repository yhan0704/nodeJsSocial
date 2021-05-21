const express = require("express");
const connectDB = require("./config/db");

const app = express();

//connect DB
connectDB;

//init middleware
//can handle json body
app.use(express.json({ extened: false }));

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started ${PORT}`));
