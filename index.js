const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const mathematics = require("./router/mathematics");

const app = express();
// const server = express();
const PORT = 5000;

const requestTime = function (format) {
	return function (req, res, next) {
		let timeLapsed = Date.now();
		let timeStamp = new Date(timeLapsed);
		switch (format) {
			case "UTC":
				req.requestTime = timeStamp.toUTCString();
				break;
			case "ISO":
				req.requestTime = timeStamp.toISOString();
				break;
			default:
				req.requestTime = timeStamp.toDateString();
		}
		next();
	};
};

app.use(morgan("dev"));
// server.use(morgan("tiny"));
app.use(cookieParser());
app.use(requestTime());

app.all("/static", (req, res, next) => {
	console.log("Logged from app.all route handler");
	next();
});
app.use("/static", express.static("public"));

app.use("/mathematics", mathematics);

app.get(
	"/",
	(req, res, next) => {
		console.log(`Logging from / route, req.cookies: ${JSON.stringify(req.cookies)}, req.requestTime: ${req.requestTime}`);
		next();
	},
	(req, res, next) => {
		// throw new Error("Sample Error...!")
		fs.readFile("/invalid_path", (err, data) => {
			if (err) {
				next(err);
			} else{
				res.send("Read file successfully");
			}
		});
		res.send(req.socket.remoteAddress);
	}
);

app.route("/book")
	.get((req, res) => {
		res.send("Get a random book");
	})
	.post((req, res) => {
		res.send("Add a book");
	})
	.put((req, res) => {
		res.send("Update the book");
	});

app.get(
	"/user/:id",
	(req, res, next) => {
		if (req.params.id === "0") {
			next("route");
		} else next();
	},
	(req, res, next) => {
		res.send("Welcome User");
	}
);

app.get("/user/:id", (req, res) => {
	res.send("Welcome Admin");
});

app.get("/friend-request/:from-:to", (req, res) => {
	res.send(`A friend request from ${req.params.from} to ${req.params.to}`);
});

app.get("/classification/:subject.:specification", (req, res) => {
	res.send(`${req.params.specification} comes under ${req.params.subject}`);
});

app.get("/pass-validate-integer/:number(\\d+)", (req, res) => {
	res.send("It is a valid integer");
});

app.get("/profile(-details)?", (req, res) => {
	res.send("Profile details...!");
});

app.get("/shaza+m", (req, res) => {
	res.send("Shazaaaaaaaam...!");
});

app.get("/saca*", (req, res) => {
	res.send("Sacagawea...!");
});

app.get(/.*fly$/, (req, res) => {
	res.send("Youk now what..?, You can fly...!");
});

app.get(/.*/, (req, res) => {
	res.send("Some random path...!");
});

app.listen(PORT, () => {
	console.log("Express server is running on PORT 5000");
});

// server.get("/", (req, res)=>{
// 	res.send("Hello from server running on port 3000");
// })

// server.listen(3000, ()=>{
// 	console.log("I'm running on the port 3000")
// })
