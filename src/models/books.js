import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();

  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });

  return book;
};

const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.insertOne(book);

  return book;
};

const updateBook = async (bookId, updatedFields) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.updateOne({ id: bookId }, { $set: updatedFields });

  return getBookById(bookId);
};

const deleteBook = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.deleteOne({ id: bookId });

  return result.deletedCount;
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };