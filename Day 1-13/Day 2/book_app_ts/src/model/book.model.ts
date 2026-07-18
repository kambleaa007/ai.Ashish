import { Book } from '../interfaces/book.interface';

let books: Book[] = [
    { id: '1', title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams' },
    { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen' }
];

const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};

export const findAll = (): Book[] => {
    return books;
};

export const findById = (id: string| string[]): Book | undefined => {
    return books.find(book => book.id === id);
};

export const create = (newBookData: Omit<Book, 'id'>): Book => {
    const newBook: Book = { id: generateId(), ...newBookData };
    books.push(newBook);
    return newBook;
};