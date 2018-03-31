const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/TodoApp';
//Change mongoose's promise to node's promise
mongoose.Promise = global.Promise;
//Connect to db. Will not do any queries till connection has been established
mongoose.connect(process.env.MONGODB_URI || dbUrl);


module.exports = {mongoose};