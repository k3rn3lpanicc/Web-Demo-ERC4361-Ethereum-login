const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { ethers } = require('ethers');

const cors = require('cors'); // Import cors middleware
const { recoverPersonalSignature } = require('eth-sig-util');

// Enable CORS for specific origins or all origins
const corsOptions = {
	origin: ['http://localhost:3000', 'http://localhost:5000'], // Replace with your frontend URL
	methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
	allowedHeaders: 'Content-Type,Authorization', // Allowed headers
	credentials: true, // Allow credentials like cookies, authorization headers, etc.
};

const app = express();
const port = 3001;

// Store nonces in memory (In production, store in a database)
const nonces = {};

app.use(cors(corsOptions));
// Middleware to parse JSON
app.use(bodyParser.json());

// API to generate nonce and return it to the front-end
app.post('/api/login', (req, res) => {
	const { walletAddress } = req.body;

	if (!walletAddress) {
		return res.status(400).json({ error: 'Wallet address is required.' });
	}

	// Generate a random nonce and save it with the wallet address
	const nonce = crypto.randomBytes(16).toString('hex');
	nonces[walletAddress] = nonce;

	return res.json({ nonce });
});

// API to verify signed message
app.post('/api/verify', async (req, res) => {
	const { walletAddress, signature, nonce } = req.body;

	if (!walletAddress || !signature || !nonce) {
		return res.status(400).json({ error: 'Invalid input.' });
	}

	const storedNonce = nonces[walletAddress];

	if (!storedNonce || storedNonce !== nonce) {
		return res.status(400).json({ error: 'Invalid nonce.' });
	}

	// Reconstruct the message that was signed
	const message = `Login to the app with the nonce: ${nonce}`;
	// Prefix the message as per the Ethereum message signing standard
	try {
		// Recover the address from the signature
		console.log({ message, signature });
		const recoveredAddress = recoverPersonalSignature({
			data: message,
			sig: signature,
		});
		console.log({ recoveredAddress, walletAddress });
		// Check if the recovered address matches the wallet address
		if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
			// Valid signature, clear nonce
			delete nonces[walletAddress];
			return res.json({ success: true, message: 'Login successful!' });
		} else {
			return res
				.status(400)
				.json({ error: 'Signature does not match.' });
		}
	} catch (error) {
		return res.status(400).json({ error: 'Signature verification failed.' });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
