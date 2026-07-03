import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

interface Book {
    id: string;
    title: string;
    author: string;
}

const app = express();
const port = 8090;

// Middleware
app.use(bodyParser.json());

// In-memory data store for books
let books: Book[] = [
    { id: '1', title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams' },
    { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen' }
];

// Helper to generate unique IDs
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};

// Routes
app.get('/books', (req: Request, res: Response) => {
    res.json(books);
});

app.get('/books/:id', (req: Request, res: Response) => {
    const book = books.find(b => b.id === req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

app.post('/books', (req: Request, res: Response) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).send('Title and Author are required');
    }
    const newBook: Book = { id: generateId(), title, author };
    books.push(newBook);
    res.status(201).json(newBook);
});

// Start the server
app.listen(port, () => {
    console.log(`Book app listening at http://localhost:${port}`);
    console.log('You might need to use a tool like ngrok to expose this port if running in a cloud environment.');
});