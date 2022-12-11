const express = require("express");
const routes = require("./routes/routes.js");
const app = express();


// route everything to https
function checkHttps(req, res, next){
  // protocol check, if http, redirect to https
  
  if(req.get('X-Forwarded-Proto').indexOf("https") !=- 1){
    console.log("https, yo")
    return next()
  } else {
    console.log("just http")
    res.redirect('https://' + req.hostname + req.url);
  }
}
//app.all('*', checkHttps);

app.use(express.static('views'));
app.use("/", routes);


// listen for requests :)
const listener = app.listen(8080, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
