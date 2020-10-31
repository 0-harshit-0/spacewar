
const express = require('express');
const app = new express();

app.use(express.static('home'));
app.use(express.static('play'));

app.get('/', (req, res) => {
	res.sendFile('/home/index.html');
});

app.get('/:mode', (req, res) => {
	//console.log(req.params);
	res.sendFile(__dirname+`/play/${req.params.mode}/t.html`, (err) => {
		res.end('go back');
	});
});


http.listen(8080, ()=> {
	console.log('bang');
});
