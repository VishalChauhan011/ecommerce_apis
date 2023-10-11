// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const connectDb = require('./config/database');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieparser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const routes = require('./routes/index.js');

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookies and file middleware
app.use(cookieparser());

// Middleware to parse JSON requests
app.use(morgan("tiny"))

//router middleware
app.use('/api/v1', routes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
