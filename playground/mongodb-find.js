const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connection to MongoDB successful');
    const db = client.db('TodoApp');
                    //Returns cursor//Returns Promise
    // db.collection('Todos').find({_id: new ObjectID('5ab533f2344e1515175742b0')}).toArray().then((docs)=> {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // });
    db.collection('Todos').count().then((count)=> {
        console.log(`Todos count ${count}`);
    });

    client.close();
});