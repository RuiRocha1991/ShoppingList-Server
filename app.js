const express = require("express");
const mogoose = require('mongoose');
const dotenv = require("dotenv");
const morgan = require('morgan');
const passport = require("passport");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const cors = require('cors');
const coockieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

connectDB();

// Load Config
dotenv.config({path: './config/config.env'});

const app = express();


// Body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sessions
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    expires: 86400000
  },
  store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// passport Config
require('./config/passport')(passport);

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  console.log(req.user);
  next();
})


app.use(cors({
  origin: process.env.CLIENT_URI, // allow to server to accept request from different origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true // allow session cookie from browser to pass through
}));

app.use(coockieParser(process.env.SECRET_KEY_PARSER));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/category', require('./routes/category.router'));


const PORT = process.env.PORT || 3001;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)