const express = require("express");
const app = express();


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

app.use(express.static('public'));
app.use(express.static('play'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/play', (req, res) => {
	res.sendFile(__dirname + `/play/${req.query.mode}/index.html`, (err) => {
    if (err) console.log("try again");
  });
});


// listen for requests :)
const listener = app.listen(8080, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
