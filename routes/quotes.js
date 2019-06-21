const express = require('express');
const quotesRouter = express.Router();
const axios = require('axios');
const mongo = require('mongodb');
const assert = require('assert');

const url = 'mongodb://localhost:27017/test';

/*let quotes = [
  {
    quote: '"I\'m not the strongest. I\'m not the fastest. But I\'m really good at suffering."',
    author: 'Amelia Boone'
  },
  {
    quote: '"It\'s unfortunate that this has happened. No. It\'s fortunate that this has happened and I\'ve remained unharmed."',
    author: 'Marcus Aurelius'
  },
  {
    quote: '"...there\'s only one really good question, which is, \'What am I unwilling to feel?\'"',
    author: 'Tara Brach'
  },
  {
    quote: '"You must want to be a butterfly so badly, you are willing to give up being a caterpillar."',
    author: 'Sekou Andrews'
  },
  {
    quote: '"Learn the rules like a pro, so you can break them like an artist."',
    author: 'Pablo Picasso'
  }
];*/

let db;

mongo.connect(url, function (err, client) {
  assert.equal(null, err);
  db = client.db('echoOnceDb');
});


quotesRouter.get('/', function (req, res, next) {
  const quotesArray = [];
    const cursor = db.collection('quotes').find();
    cursor.forEach(function(quote, err) {
      assert.equal(null, err);
      quotesArray.push(quote);
    }, function() {
      res.send({
        quotes: quotesArray
      });
    });
  
});

quotesRouter.post('/', function (req, res, next) {
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

quotesRouter.post('/update', function (req, res, next) {

});

quotesRouter.post('/delete', function (req, res, next) {

});

/* quotesRouter.post('/', (req, res, next) => {
  const receivedQuote = createElement('quotes', req.query);
  if (receivedQuote) {
    quotes.push(receivedQuote);
    res.status(201).send(receivedQuote);
  } else {
    res.status(400).send();
  }
}); */


module.exports = quotesRouter;
