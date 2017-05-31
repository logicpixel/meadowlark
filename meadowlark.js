var express = require("express");
var fortune = require("./lib/fortune");
var app = express();

//handlebars engine
var handlebars = require("express-handlebars").create({defaultLayout: "main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function(){
  console.log("Express started on http://localhost:" + app.get("port") + "; press CRTL+C to terminate.")
});
//Routes
app.use(express.static(__dirname + "/public"));
/*Home Page*/
app.get("/", function(req, res){
  res.render("home");
});
/*About Page*/
app.get("/about", function(req, res){
  res.render("about", {fortune: fortune.getFortune()});
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
