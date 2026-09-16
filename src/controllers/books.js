import {
  getAllBooks as getAllBooksFromDb,
  getBookById as getBookByIdFromDb,
  createBook as createBookFromDb,
  updateBook as updateBookFromDb,
  deleteBook as deleteBookFromDb
} from '../models/books.js';
import { getAuthorById } from '../models/authors.js';

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooksFromDb();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const book = await getBookByIdFromDb(requestedId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    if (!id || !authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'id, authorId, title, and publicationDate are required' });
    }

    const existingBook = await getBookByIdFromDb(id);
    if (existingBook) {
      return res.status(400).json({ message: 'Book id already exists' });
    }

    const author = await getAuthorById(authorId);
    if (!author) {
      return res.status(400).json({ message: 'authorId does not match an existing author' });
    }

    const newBook = { id, authorId, title, publicationDate };
    const createdBook = await createBookFromDb(newBook);

    return res.status(201).json(createdBook);
  } catch (error) {
    console.error('POST /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const { authorId, title, publicationDate } = req.body;

    if (!authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'authorId, title, and publicationDate are required' });
    }

    const existingBook = await getBookByIdFromDb(requestedId);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = await getAuthorById(authorId);
    if (!author) {
      return res.status(400).json({ message: 'authorId does not match an existing author' });
    }

    const updatedBook = await updateBookFromDb(requestedId, { authorId, title, publicationDate });
    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBookHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const existingBook = await getBookByIdFromDb(requestedId);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await deleteBookFromDb(requestedId);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler };