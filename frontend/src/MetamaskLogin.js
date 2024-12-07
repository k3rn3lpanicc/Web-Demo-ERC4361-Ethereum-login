import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import './MetamaskStyle.css'; // Import the CSS file

const MetamaskLogin = () => {
	const [walletAddress, setWalletAddress] = useState('');
	const [nonce, setNonce] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		if (!window.ethereum) {
			setError('MetaMask is not installed!');
			return;
		}

		setLoading(true);

		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const accounts = await provider.send('eth_requestAccounts', []);
			const wallet = accounts[0];

			setWalletAddress(wallet);

			// Use the service name from docker-compose.yml (backend)
			console.log('prefix: ', 'http://localhost:3001');
			const response = await axios.post(
				`http://localhost:3001/api/login`,
				{ walletAddress: wallet }
			);
			setNonce(response.data.nonce);
			console.log(response.data);
			// Show the message for the user to sign
			setMessage(`Sign this message to login: ${response.data.nonce}`);
			setError('');
		} catch (err) {
			setError('Error connecting to MetaMask');
		} finally {
			setLoading(false);
		}
	};

	const handleSignMessage = async () => {
		if (!nonce) {
			setError('No nonce to sign');
			return;
		}

		setLoading(true);

		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const message = `Login to the app with the nonce: ${nonce}`;
			const signature = await signer.signMessage(message);

			// Use the service name from docker-compose.yml (backend)
			const response = await axios.post(
				`http://localhost:3001/api/verify`,
				{
					walletAddress,
					signature,
					nonce,
				}
			);

			if (response.data.success) {
				setIsLoggedIn(true);
				setMessage('Login successful!');
				setError('');
			} else {
				setError(response.data.error || 'Login failed');
			}
		} catch (err) {
			setError('Error signing the message');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-container">
			{!isLoggedIn ? (
				<div>
					<button onClick={handleLogin} disabled={loading}>
						{loading ? (
							<div className="spinner"></div>
						) : (
							'Login with MetaMask'
						)}
					</button>
					{walletAddress && (
						<div className="wallet-info">
							Wallet Address: {walletAddress}
						</div>
					)}
					{message && (
						<div className="message">{message}</div>
					)}
					{nonce && (
						<button
							onClick={handleSignMessage}
							disabled={loading}
						>
							{loading ? (
								<div className="spinner"></div>
							) : (
								'Sign Message to Login'
							)}
						</button>
					)}
					{error && <div className="error">{error}</div>}
				</div>
			) : (
				<div className="success">Welcome, {walletAddress}!</div>
			)}
		</div>
	);
};

export default MetamaskLogin;
