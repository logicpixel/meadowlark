var express = require("express");
var fortune = require("./lib/fortune");
var app = express();

//handlebars engine
var handlebars = require("express-handlebars").create({defaultLayout: "main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function(){
  console.log("Express started on http://localhost:" + app.get("port") + "; press CRTL+C to terminate.");
});
//Routes
app.use(express.static(__dirname + "/public"));

//QA tools
app.use(function(req, res, next){
  res.locals.showTests = app.get("env") !== 'production' && req.query.test === "1";
  next();
});
/*Home Page*/
app.get("/", function(req, res){
  res.render("home");
});
/*About Page*/
app.get("/about", function(req, res){
  res.render("about", {
    fortune: fortune.getFortune(),
    pageTestScript: 'qa/tests-about.js'
  });
});
app.get("/tours/hood-river", function(req, res){
  res.render("tours/hood-river");
});
app.get("/tours/request-group-rate", function(req, res){
  res.render("tours/request-group-rate");
});
//Default 404 Page
app.use(function(req, res){
    res.status(404);
    res.render("404");
});
//Internal Server Error
app.use(function(err, req, res, next){
    res.status(500);
    res.render("500");
});
