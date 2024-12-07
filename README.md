
# Metamask Login with Backend Verification

This project provides a simple login system using Metamask for authentication. The backend verifies the login using a signed message containing a nonce. The project is built using Node.js with Express for the backend and React for the frontend. The application is containerized using Docker and Docker Compose.

## Table of Contents

1. [Installation](#installation)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Project](#running-the-project)
5. [CORS Configuration](#cors-configuration)
6. [Docker and Docker Compose](#docker-and-docker-compose)
7. [Project Structure](#project-structure)
8. [Error Handling](#error-handling)
9. [License](#license)

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 18 or higher)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Metamask Extension](https://metamask.io/) installed in your browser

### Steps

Clone the repository to your local machine:

   ```bash
   git clone https://github.com/k3rn3lpanicc/Web-Demo-ERC4361-Ethereum-login.git
   cd Web-Demo-ERC4361-Ethereum-login
   ```

### Running the Backend

To run the backend server locally:

```bash
cd backend
node server.js
```

The backend will be running on `http://localhost:3000`.

## Frontend Setup

### Configuration

In the frontend, you will need to update the API URL in `MetamaskLogin.js` to match the backend URL. You can modify it to use the Docker network name or `localhost` for local development.

### Running the Frontend

To start the frontend locally:

```bash
cd frontend
npm run start
```

The frontend will be running on `http://localhost:5000`.

## Running the Project

1. To run the entire project locally, start both the backend and frontend servers as described above.
   
2. Alternatively, you can run the project using Docker Compose (explained in the next section).

### CORS Configuration

The backend is configured to handle CORS (Cross-Origin Resource Sharing) using the `cors` middleware. The frontend running on `http://localhost:3000` will be allowed to make requests to the backend running on `http://localhost:5000`.

In the backend, the CORS configuration is as follows:

```javascript
const corsOptions = {
  origin: ['http://localhost:3000'], // Frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

app.use(cors(corsOptions));
```

### Docker and Docker Compose

To run both the frontend and backend using Docker Compose, make sure you have Docker and Docker Compose installed.

#### Running the Project with Docker Compose

1. Build and start the containers using Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. This will build the Docker images for both the frontend and backend and start the containers. The frontend will be accessible at `http://localhost:3000`, and the backend will be accessible at `http://localhost:5000`.

#### Docker Setup Details

- **Backend Dockerfile**: Defines the setup for the Node.js backend server, including dependencies and runtime environment.
- **Frontend Dockerfile**: Defines the setup for the React frontend, including the build process.
- **docker-compose.yml**: Defines the multi-container Docker setup, linking the frontend and backend together.

## Project Structure

```
/metamask-login-backend-frontend
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── server.js (or app.js)
│   ├── package.json
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── src/
│   └── ...
├── docker-compose.yml
└── README.md
```

## Error Handling

- **Frontend**: Errors from the backend, such as invalid signatures or failed verifications, will be caught and displayed with appropriate messages.
- **Backend**: If the wallet address or signature is invalid, the backend will respond with a `400` status and an error message.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

