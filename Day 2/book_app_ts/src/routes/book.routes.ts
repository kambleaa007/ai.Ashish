import { Router } from 'express';

import { getBooks, getBookById, createBook } from '../controller/book.controller';


const router = Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);

export default router;