const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
    
}

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');


const port = process.env.PORT ;

const {User} = require('./Models/user');
const {Todo} = require('./Models/todo');

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const addTodo = new Todo({text: req.body.text});
    addTodo.save().then((todo) => {
        res.send({todo});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        //send object over array in case want to have custom object key:values
        res.send({todos});
    }).catch((err) => res.status(400).send(err));
});


app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id))
        res.status(404).send();

    Todo.findById(id).then((todo) => {
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo})
    }).catch( (err) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});


app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    //use pick to only take params that user can change
    const body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    } 

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (todo) => {
        //Check if todo object exists
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch( (e) => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send({user});
    }).catch((err) => {
        res.status(400).send(err);
    });
});


app.listen(port, () => {
    console.log('Listening on port 3000.\n\t-Webserver has started.');
});

module.exports = {app};