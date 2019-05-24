var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  let quotes = [
    {
      quote: '"I\'m not the strongest. I\'m not the fastest. But I\'m really good at suffering."',
      name: 'Amelia Boone'
    },
    {
      quote: '"It\'s unfortunate that this has happened. No. It\'s fortunate that this has happened and I\'ve remained unharmed."',
      name: 'Marcus Aurelius'
    },
    {
      quote: '"...there\'s only one really good question, which is, \'What am I unwilling to feel?\'"',
      name: 'Tara Brach'
    },
    {
      quote: '"You must want to be a butterfly so badly, you are willing to give up being a caterpillar."',
      name: 'Sekou Andrews'
    }
  ];

  res.json({
    data: quotes
  });

});

module.exports = router;
