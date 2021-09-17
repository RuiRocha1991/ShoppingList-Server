const express = require("express");
const dotenv = require("dotenv");

// Load Config
dotenv.config({path: './config/config.env'});

const app = express();
const router = express.Router();


// Routes
app.use('/', router.get('/',(req, res) => {
  res.status(200).json({message: "Welcome guys to GET"}).send();
}));
app.use('/', router.post('/',(req, res) => {
  res.status(200).json({message: "Welcome guys to POST"}).send();
}));
app.use('/', router.put('/',(req, res) => {
  res.status(200).json({message: "Welcome guys to PUT"}).send();
}));
app.use('/', router.delete('/',(req, res) => {
  res.status(200).json({message: "Welcome guys to DELETE"}).send();
}));

const PORT = process.env.PORT || 3001;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)