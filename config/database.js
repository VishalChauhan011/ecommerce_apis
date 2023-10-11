// config/database.js

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
    .then(console.log('MongoDB connected'))
    .catch(err => {
      console.log("DATABASE ERROR: ", err.message);
      process.exit(1);
    })
}

module.exports = connectDB
