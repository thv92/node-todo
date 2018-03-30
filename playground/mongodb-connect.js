const {MongoClient, ObjectID} = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';


MongoClient.connect(url, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server'); //prevent rest of function from executing
    }
    console.log('Connected to MongoDB server')
    const db = client.db(dbName);
    db.collection('Todos').insertOne({
        text: 'Insert second record',
        completed: false
    }, (err, result) => {
        if(err) {
            return console.log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });



    client.close();
});