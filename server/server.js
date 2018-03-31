const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const {User} = require('./Models/user');
const {Todo} = require('./Models/todo');

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const addTodo = new Todo({...req.body});
    addTodo.save().then((doc) => {
        console.log('Added Todo Document to db:\n', addTodo);
        res.send(doc);
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
        res.status.send({todo})
    }).catch( (err) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log('Listening on port 3000.\n\t-Webserver has started.');
});

module.exports = {app};