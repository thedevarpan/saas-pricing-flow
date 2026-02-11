const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const connectToDB = require("./db/db");

/* Invoked database connection */
connectToDB();

/* Import routes */
const indexRouter = require("./routes/index.routes");
const authRouter = require("./routes/auth.routes");

/* Basic Express server setup */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Setup ejs*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Setup ejs*/
app.use(express.static(path.join(__dirname, "public")));

/* Health test route */
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

/* Frontend routes */
app.use("/", indexRouter);

/* Authentication routes*/
app.use("/user", authRouter);



app.listen(process.env.PORT || 3000, (err) => {
    if (!err) {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    } else {
        console.error("Error starting server:", err);
    }
});