const express = require('express');
const quotesRouter = express.Router();
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017/test';

let db;

mongo.connect(url, { useNewUrlParser: true }, function (err, client) {
  assert.equal(null, err);
  db = client.db('echoOnceDb');
});

quotesRouter.get('/', function (req, res, next) {
  const quotesArray = [];
  const cursor = db.collection('quotes').find();
  cursor.forEach(function (quote, err) {
    assert.equal(null, err);
    quotesArray.push(quote);
  }, function () {
    res.send({
      quotes: quotesArray
    });
  });
});

//Submit Request
quotesRouter.post('/submit', function (req, res, next) {
  const item = {
    quote: req.body.quote,
    author: req.body.author
  };

  if (db) {
    db.collection('quotes').insertOne(item, function (err, result) {
      assert.equal(null, err);
      console.log('Item Inserted');
    });
  } else {
    console.log('db connection not ready yet')
  }

  res.redirect('/')
});

//Update Request
quotesRouter.post('/update', function (req, res, next) {
  const item = {
    quote: req.body.quote,
    author: req.body.author
  };

  const id = req.body.id

  if (db) {
    db.collection('quotes').updateOne({ "_id": ObjectID(id) }, { $set: item }, function (err, result) {
      assert.equal(null, err);
      console.log('Item Updated');
    });
  } else {
    console.log('db connection not ready yet')
  }
});

//Delete Request
quotesRouter.post('/delete', function (req, res, next) {
  const id = req.body.id

  if (db) {
    db.collection('quotes').deleteOne({ "_id": ObjectID(id) }, function (err, result) {
      assert.equal(null, err);
      console.log('Item Deleted');
    });
  } else {
    console.log('db connection not ready yet')
  }
});

module.exports = quotesRouter;
