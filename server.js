const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const connectToDB = require("./db/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const paymentRouter = require("./routes/payment.routes");
const userModel = require("./models/user.model");
/* Invoked database connection */
connectToDB();

/* Import routes */
const indexRouter = require("./routes/index.routes");
const authRouter = require("./routes/auth.routes");
const adminRouter = require("./routes/admin.routes");

app.use("/payment/webhook", express.raw({ type: "application/json" }));
/* Basic Express server setup */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Server static fils */
app.use(express.static("public"));


/* Setup express session */
app.set("trust proxy", 1);
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
            secure: process.env.ENV === "production", // true in production (HTTPS)
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

/* Setup flash message */
app.use((req, res, next) => {
    res.locals.errorMessage = req.session.errorMessage || null;
    res.locals.successMessage = req.session.successMessage || null;
    res.locals.paymentSuccess = req.session.paymentSuccess || null;

    delete req.session.errorMessage;
    delete req.session.successMessage;
    delete req.session.paymentSuccess;

    next();
});

/* Set user globally */
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


app.use(async (req, res, next) => {
    if (req.session.user?.id) {
        const user = await userModel.findById(req.session.user.id);
        res.locals.user = user;
    } else {
        res.locals.user = null;
    }
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

/* Admin routes */
app.use("/admin", adminRouter);

/* Handle 404 errors */
app.use((req, res, next) => {
    res.status(404).render("404");
});


app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("errors/500");
});


/* Listen to server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (!err) {
        console.log(`Server is running on port ${PORT}`);
    } else {
        console.error("Error starting server:", err);
    }
});