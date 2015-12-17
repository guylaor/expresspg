var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/pg';
var data = [];



router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware

  var find_obj = {}
  if ( typeof req.query.state === "undefined") {
    find_obj = { "state": "NY" }
  }

  console.log("This is first");

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {

    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('yelp');

      var cursor = collection.find( find_obj );

      //We need to sort by age descending
      cursor.sort({name: 1});

      //Limit to max 10 records
      cursor.limit(10);

      //Skip specified records. 0 for skipping 0 records.
      cursor.skip(0);

      //Lets iterate on the result
      cursor.each(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
      //  console.log('Fetched:', doc["name"]);
        data.push(doc);
      }
      });

      console.log("finished mongo");
    }
  });



  next();
});


/* GET users listing. */
router.get('/', function(req, res, next) {


  console.log("than this second");

        res.render('search', { title: 'Express', _data: data });
});

module.exports = router;
