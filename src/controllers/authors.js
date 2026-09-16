import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorFromDb,
  updateAuthor as updateAuthorFromDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks
} from '../models/authors.js';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('GET /authors failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const author = await getAuthorByIdFromDb(requestedId);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('GET /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve author.' });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body;

    if (!id || !name || typeof birthYear !== 'number') {
      return res.status(400).json({ message: 'Missing or invalid required author fields.' });
    }

    const existingAuthor = await getAuthorByIdFromDb(id);
    if (existingAuthor) {
      return res.status(400).json({ message: 'Author id already exists.' });
    }

    const createdAuthor = await createAuthorFromDb({ id, name, birthYear });
    return res.status(201).json(createdAuthor);
  } catch (error) {
    console.error('POST /authors failed:', error.message);
    return res.status(500).json({ message: 'Unable to create author.' });
  }
};

const updateAuthor = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const { name, birthYear } = req.body;

    if (!name || typeof birthYear !== 'number') {
      return res.status(400).json({ message: 'Missing or invalid required author fields.' });
    }

    const existingAuthor = await getAuthorByIdFromDb(requestedId);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const updatedAuthor = await updateAuthorFromDb(requestedId, { name, birthYear });
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('PUT /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to update author.' });
  }
};

const deleteAuthor = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const existingAuthor = await getAuthorByIdFromDb(requestedId);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const hasBooks = await authorHasBooks(requestedId);
    if (hasBooks) {
      return res.status(409).json({ message: 'Author cannot be deleted because they still have books.' });
    }

    await deleteAuthorFromDb(requestedId);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete author.' });
  }
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };