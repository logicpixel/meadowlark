var express = require("express");
var fortune = require("./lib/fortune");
var formidable = require("formidable");
var jqupload = require("jquery-file-upload-middleware");
var credentials = require("./credentials");
var app = express();
//Cookies + Session
app.use(require("cookie-parser")(credentials.cookieSecret));
app.use(require("express-session")());

app.use(function(req, res, next){
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

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
app.get("/newsletter/signup", function(req, res){
  res.render("newsletter/archive");
});

function NewsletterSignup(){

}
NewsletterSignup.prototype.save = function(cb){
  cb();
};

app.post("/newsletter", function(req, res){
  var name = req.body.name || "";
  var email = req.body.email || "";

  if(!email.match(VALID_EMAIL_REGEX)){
    if(req.xhr){
      return res.json({error: 'Invalid Email Address'});
    }
    req.session.flash = {
      type: "danger",
      intro: "Validation Error",
      message: "The email address entered is invalid"
    };
    return res.redirect(303, "/newsletter/archive");
  }
  new NewsletterSignup({name: name, email: email}).save(function(err){
    if(err){
      if(req.xhr){
        return res.json({error: "Database error"});
      }
      req.session.flash = {
        type: "danger",
        intro: "Database Error",
        message: "There was a database error; unable to save."
      }
      return res.redirect(303, "/newsletter/archive");
    }
    if(req.xhr){
      return res.json({success: true});
    }
    req.session.flash = {
      type: "success",
      intro: "Thank You",
      message: "You have been added to our newsletter"
    };
    return res.redirect(303, "/newsletter/archive");
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
  req.session.userName = "AABBCC";

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
