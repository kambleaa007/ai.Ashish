import { Request, Response } from 'express';
import * as BookModel from '../model/book.model';

export const getBooks = (req: Request, res: Response) => {
    const books = BookModel.findAll();
    res.json(books);
};

export const getBookById = (req: Request, res: Response) => {
    const book = BookModel.findById(req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
};

export const createBook = (req: Request, res: Response) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).send('Title and Author are required');
    }
    const newBook = BookModel.create({ title, author });
    res.status(201).json(newBook);
};