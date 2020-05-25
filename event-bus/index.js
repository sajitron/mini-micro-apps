const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const events = [];

app.post('/events', (req, res) => {
	const event = req.body;

	// * save data in case query service goes down
	events.push(event);

	// * posts
	axios.post('http://posts-cluster-ip-srv:4000/events', event);
	// * comments
	axios.post('http://comments-srv:4004/events', event);
	// * query
	axios.post('http://query-srv:4002/events', event);
	// * moderation
	axios.post('http://moderation-srv:4003/events', event);

	res.status(201).send({ status: 'OK' });
});

app.get('/events', (req, res) => {
	res.send(events);
});

app.listen(4005, () => {
	console.log('Listening on port 4005');
});
