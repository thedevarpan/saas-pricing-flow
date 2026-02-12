const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const connectToDB = require("./db/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const paymentRouter = require("./routes/payment.routes")
/* Invoked database connection */
connectToDB();

/* Import routes */
const indexRouter = require("./routes/index.routes");
const authRouter = require("./routes/auth.routes");

/* Basic Express server setup */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Setup express session */
app.use(
    session({
        name: "user_session",
        secret: process.env.SESSION_SECRET || "supersecretkey",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: "sessions",
        }),
        cookie: {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

/* Setup flash message */
app.use((req, res, next) => {
    res.locals.errorMessage = req.session.errorMessage || null;
    res.locals.successMessage = req.session.successMessage || null;
    
    delete req.session.errorMessage;
    delete req.session.successMessage;

    next();
});

/* Set user globally */
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


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

/* */
app.use("/payment", paymentRouter);


app.listen(process.env.PORT || 3000, (err) => {
    if (!err) {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    } else {
        console.error("Error starting server:", err);
    }
});