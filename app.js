//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

/ Requests targetting all articles /

app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }  
    }); 
})

.post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err){
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if (!err){
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

/ Requests targetting a specific article /

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }  
    });
})

.put(function(req, res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if (!err){
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
})

.patch(function(req, res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if (!err){
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

/*
{
        "_id": "632db2301bd1ae430ee42717",
        "title": "REST",
        "content": "REST is short for REpresentational State Transfer. It's an architectural style for designing APIs."
    },
    {
        "_id": "632db2b61bd1ae430ee42718",
        "title": "Bootstrap",
        "content": "This is a framework developed by Twitter that contains pre-made front-end templplates for websites"
    },
    {
        "_id": "632db2f11bd1ae430ee42719",
        "title": "DOM",
        "content": "The Document Object Model is like an API for interacting with our HTML"
    },
    {
        "_id": "63319f41ca1b36e424696b93",
        "title": "Jack Bauer",
        "content": "Jack Bauer once stepping into quicksand. The quicksand couldn't escape and nearly drowned.",
        "__v": 0
    }
*/