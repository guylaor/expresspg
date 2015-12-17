var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/pg';
var data = [];


/*
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
*/

var findRestaurants = function(db, find_obj, callback) {
   var cursor =db.collection('yelp').find( find_obj, {"web_text":0} );
   cursor.sort({name: 1});
   cursor.limit(50);

   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         data.push(doc);
         console.dir(doc);
      } else {
         callback();
      }
   });
};


/* GET users listing. */
router.get('/', function(req, res, next) {
  data = [];
  var find_obj = {}
  if ( typeof req.query.state === "undefined") {
    find_obj = { "state": "NY" }
  } else {
    find_obj = { "state": req.query.state }
  }

  MongoClient.connect(url, function(err, db) {
   assert.equal(null, err);
   findRestaurants(db, find_obj, function() {
       db.close();
       res.render('search', { title: 'Express', _data: data });
   });
 });

      //  res.render('search', { title: 'Express', _data: data });
});

module.exports = router;
