import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).toArray();

  return authors;
};

const getAuthorById = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id: authorId });

  return author;
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection('authors');
  await collection.insertOne(author);

  return author;
};

const updateAuthor = async (authorId, updatedFields) => {
  const db = getDb();
  const collection = db.collection('authors');
  await collection.updateOne({ id: authorId }, { $set: updatedFields });

  return getAuthorById(authorId);
};

const deleteAuthor = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.deleteOne({ id: authorId });

  return result.deletedCount;
};

const authorHasBooks = async (authorId) => {
  const db = getDb();
  const collection = db.collection('books');
  const matchingBook = await collection.findOne({ authorId });

  return Boolean(matchingBook);
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};