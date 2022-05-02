//jshint esversion:6
//Backend Only RESTful API. Used Postman to to test API (meaning no front-end needed)
//Intialized MongoDB with Robo3T
//Allows users to GET (read), POST (create), PUT/PATCH (update), or DELETE "Articles" to a database.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Create Mongoose database named "wikiDB"
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

//Create Mongoose Schema
const articleSchema = new mongoose.Schema ({
  title: String,
  content: String
});

//Create Mongoose Model
const Article = mongoose.model("Article", articleSchema);


// Refactored code to use Chained Route Handlers using Express
//RESTful, HTTP verbs GET, POST, DELETE chained together.
//These live under "/articles"
//________Requests Targetting all Articles________________________________
app.route("/articles")

//REST- GET, return all articles, JSON format
.get(function(req, res){
  //find method, no conditions - returns all articles,
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    } else{
      res.send(err);
    }
  });
})

//REST - POST/CREATE send new articles route per RESTful rules
.post(function(req, res){

  //Create + assign article to document with mongoose schema
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  //save to Mongoose model
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.");
    } else{
      res.send(err);
    }
  });

})

//REST - DELETE to ALL articles
.delete(function(req, res){
  //no condistions deletes ALL
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    } else{
      res.send(err);
    }
  });
});
//________________________________

////________Requests Targetting a Specific Article________________________________
//using Route Parameters from user
//HTTP Verbs - GET, PUT, PATCH, DELETE
app.route("/articles/:articleTitle")
//REST - GET/READ specific article title
.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles matching that title were found.");
    }

  });
})
//REST - PUT/UPDATE specific article (replaces the entire document, empty fields become null!)
.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article");
      }else{
        res.send(err);
      }
    }

  );
})

//REST - PATCH updates specific article only fields that are provided
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully patched article");
      }else{
        res.send(err);
      }
    }
  );
})

//REST - DELETE specific article
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the specific article");
      } else{
        res.send(err);
      }

  });
});
//______________end of Specific Article REST_____________


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
