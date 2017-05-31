var fortunes = [
  "Test1",
  "Test2",
  "Test3",
  "Test4",
  "Test5"
];
exports.getFortune = function(){
 return fortunes[Math.floor(Math.random()*fortunes.length)];
}
