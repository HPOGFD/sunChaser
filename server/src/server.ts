import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static('../client/dist'));
app.use(express.json());


// TODO: Implement middleware for parsing JSON and urlencoded form data

app.use(express.urlencoded({ extended: true }));
app.post('/json-data', (req, res) => {
  const data = req.body; // Parsed JSON data will be available here
  res.json({
    message: 'Received JSON data',
    receivedData: data
  });
});

  

// TODO: Implement middleware to connect the routes
app.use('/api', routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
