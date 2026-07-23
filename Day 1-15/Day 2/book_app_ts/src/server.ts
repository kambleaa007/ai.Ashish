import express from 'express';
import bodyParser from 'body-parser';
import bookRoutes from './routes/book.routes';

const app = express();
const port = 8090;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/books', bookRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('Book API is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Book app listening at http://localhost:${port}`);
    console.log('You might need to use a tool like ngrok to expose this port if running in a cloud environment.');
});