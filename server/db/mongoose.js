const mongoose = require('mongoose');
//Change mongoose's promise to node's promise
mongoose.Promise = global.Promise;
//Connect to db. Will not do any queries till connection has been established
mongoose.connect(process.env.MONGODB_URI)
        .catch((err) => {
            console.log('Unable to connect to mongodb. Verify that db is running.', err);
});


module.exports = {mongoose};