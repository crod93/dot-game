// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const sassMiddleware = require('node-sass-middleware');

app.use(
	sassMiddleware({
		src: __dirname + '/public',
		dest: '/tmp',
		debug: true,
	})
);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('/tmp'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
	response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(3000, function () {
	console.log('Your app is listening on port ' + listener.address().port);
});
