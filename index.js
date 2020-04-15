const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasks';

let mongo;
MongoClient
  .connect(mongoUrl, {
    useUnifiedTopology: true
  })
  .then(function(client) {
    mongo = client.db();
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  mongo
    .collection('tasks')
    .find()
    .toArray()
    .then(function(tasks) {
      res.render('tasks/index', { tasks });
    });
});

app.post('/', (req, res) => {
  mongo
    .collection('tasks')
    .insertOne({
      name: req.body.name,
      completed: false
    })
    .then(function() {
      res.redirect('/');
    });
});

app.post('/tasks/:id/complete', (req, res) => {
  mongo
    .collection('tasks')
    .findOne({
      _id: ObjectId(req.params.id)
    })
    .then(function(task) {
      mongo
        .collection('tasks')
        .updateOne({
          _id: ObjectId(req.params.id)
        }, {
          $set: {
            completed: !task.completed
          }
        })
        .then(function() {
          res.redirect('/');
        });
    });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
