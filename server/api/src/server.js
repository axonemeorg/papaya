const express = require('express');
const cors = require('cors'); // Import cors

const app = express();

// Allow requests from specific origins
const allowedOrigins = ['http://localhost:9475', 'app.tryzisk.com', 'http://192.168.68.68:9475'];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true, // Allow cookies and other credentials
}));

const PORT = process.env.PORT || 9000;
const SERVER_NAME = process.env.SERVER_NAME || '';

// Health check endpoint
app.get('/', (req, res) => {
	res.json({
		zisk: 'Welcome',
		version: '0.3.0',
		serverName: SERVER_NAME,
		status: 'ok'
	});
});

app.post('/database', (req, res) => {
	// Creates a database for the currently signed-in user
	
})

// Start the server
app.listen(PORT, () => {
	console.log(`Node API running on port ${PORT}`);
});
