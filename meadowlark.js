var express = require("express");
var fortune = require("./lib/fortune");
var formidable = require("formidable");
var jqupload = require("jquery-file-upload-middleware");
var app = express();
app.use(require('body-parser')());
//handlebars engine
var handlebars = require("express-handlebars").create({
    defaultLayout: "main",
    helpers: {
      section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      }
    }
});
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
//jQuery file upload
app.use("/upload", function(req, res, next){
  var now = Date.now();
  jqupload.fileHandler({
    uploadDir: function(){
      return __dirname+"/public/uploads/"+now;
    },
    uploadUrl: function(){
      return "/uploads/"+now;
    }
  })(req, res, next);
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
//Form processing
app.get("/newsletter", function(req, res){
  res.render("newsletter", {
    csrf: "MY CSRF TOKEN"
  });
});
app.post("/process", function(req, res){
  console.log("FORM FROM: " + req.query.form);
  console.log("CSRF TOKEN: " + req.body._csrf);
  console.log("NAME: " + req.body.name);
  console.log("EMAIL: " + req.body.email);
  if(req.xhr || req.accepts("json,html") === "json"){
    res.send({
      success: true
    });
  }
  else{
    res.redirect(303, "/thank-you");
  }
});
//Photo contest
app.get("/contest/vacation-photo", function(req, res){
  var now = new Date();
  res.render("contest/vacation-photo", {
    year: now.getFullYear(),
    month: now.getMonth()
  })
});
app.post("/contest/vacation-photo/:year/:month", function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    if(err){
      return res.redirect(303, "/error");
    }
    console.log("Received Fields: ");
    console.log(fields);
    console.log("Received Files: ");
    console.log(files);
    res.redirect(303, "/thank-you");
  });
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
