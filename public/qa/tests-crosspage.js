var Browser = require("zombie");
var browser;

suite("Cross-Page Tests", function(){
  setup(function(){
    browser = new Browser();
  });
  test("Requesting a group rate quote from hood river tour page, should populate referrer field", function(done){
    var referrer = "http://localhost:3000/tours/hood-river";
    browser.visit(referrer, function(){
      browser.clickLink('.requestGroupRate', function(){
        browser.assert.element('#referrer',referrer);
        done();
      });
    });
  });
  test("Requesting a group rate from the oregon coast tour page, should populate the referrer field", function(done){
    var referrer = "http://localhost:3000/tours/oregon-coast";
    browser.visit(referrer, function(){
      browser.clickLink("a[class='requestGroupRate']", function(){
        browser.assert.element('#referrer',referrer);
        done();
      });
    });
  });
  test("Visiting the \"request group rate\" page directly should result in an empty referrer", function(done){
    browser.visit("http://localhost:3000/tours/request-group-rate", function(){
      browser.assert.element('#referrer', "");
      done();
    });
  });
});
