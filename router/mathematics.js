const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Welcome to Mathematics...!");
});

router.get("/about", (req, res) => {
	res.send("About Mathematics");
});

router.get("/theorems", (req, res) => {
	res.send("Interesting Theorems about Mathematics...!");
});


module.exports = router