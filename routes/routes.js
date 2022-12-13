const express = require("express");
const path = require("path");
const router = express.Router();

// homepage
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/../views/index/index.html'));
});

// play
router.get('/play', (req, res) => {
	res.sendFile(path.join(__dirname + `/../views/play/index.html`), (err) => {//${req.query.mode}/
		if (err) console.log("try again");
	});
});

module.exports = router;