// REQUIRE EXPRESS, HTTO, SCOKET IO AND AXIOS
const express  = require("express"),
      http     = require("http"),
      socketIo = require("socket.io"),
      axios    = require("axios");

const port  = process.env.PORT || 4001;
const index = require("./routes/index.js");

const app = express();
app.use(index);

const server = http.createServer(app);

// WIRE EXPRESSJS SERVER TO SOCKET.IO
const io = socketIo(server);

var key = "5b57bcaa52456828c11e3c5b3c404900";

const getApiAndEmit = async socket => {
	try{
		const res = await axios.get(
			"https://api.darksky.net/forecast/"+key+"/43.7695,11.2558");
		socket.emit("FromAPI", res.data.currently.temperature);
		
	} catch (error){
		console.error(`Error: ${error.code}`);
	}
};

//listens for events (connected || disconnected) resends-
// -api results every 10 seconds in real time
io.on("connection", socket => {
	console.log("New client connected");
	if(interval){
		clearInterval(interval);
	}
	interval = setInterval(() => getApiAndEmit(socket), 10000);

	socket.on("disconnect", () => { console.log("Client disconnected");
});
});
// note this assumes one user not production amout of users


//listen for incoming connections
server.listen(port, () => console.log(`Listening on port ${port}`));