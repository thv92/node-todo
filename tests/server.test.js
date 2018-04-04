const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongoose');
const {app} = require('./../server/server');
const {Todo} = require('./../server/Models/todo');

const todos = [
    {
        _id: new ObjectID(),
        text: 'First todo test'
    },
    {   
        _id: new ObjectID(),
        text: 'Second todo test'
    }
];


//Lifecycle method runs before every test case
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        let text = 'Test todo text';

        request(app)
          .post('/todos')
          .send({text})
          .expect(200)
          .expect((res) => {
            expect(res.body.text).toBe(text);
          })
          .end((err, res) => {
            if(err) {
                //stops function execution
                return done(err);
            }
            //Should work because we cleared db before this
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(3);
                expect(todos[2].text).toBe(text);
                done();
            }).catch( (e) => done(e) );
          });
    });

    it('Should not create Todo because of invalid data', (done) => {
        request(app)
          .post('/todos')
          .send({})
          .expect(400)
          .end((err, res) => {
              if(err) {
                  return done(err);
              }
              Todo.find().then((todos) => {
                  expect(todos.length).toBe(2);
                  done();
              }).catch((e) => done(e));
          });
    });
});



describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {
              expect(res.body.todos.length).toBe(2);
          }).end(done);
    });
})

describe('GET /todos/id', () => {
    it('Should return todo doc', (done) => {
        request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
          }).end(done);
    });


    it('Should return with 404 on invalid ID', (done) => {
        request(app)
          .get('/todos/123')
          .expect(404)
          .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        request(app)
          .get(`/todo/${new ObjectID().toHexString()}`)
          .expect(404)
          .end(done);
    });
});


describe('DELETE /todos/id', () => {
    it('Should remove a todo', (done) => {
        const id = todos[0]._id;
        request(app)
          .delete(`/todos/${id}`)
          .expect(200)
          .expect((res) => {
              expect(res.body.expect.todo._id).toBe(id);
          })
          .end((err, res) => {
              if(err)
                return done(err);

              Todo.findById(id).then((doc) => {
                  expect(doc).toNotExist();
                  done();
              }).catch((e) => done(e));
          });
    });

    it('Should return 404 if todo not found', (done) => {
        request(app)
          .delete(`/todos/${new ObjectID().toHexString()}`)
          .expect(404)
          .end(done);
    });

    it('Should return 404 if object ID is invalid', (done) => {
        request(app)
          .delete('todos/123')
          .expect(404)
          .end(done);
    });

})