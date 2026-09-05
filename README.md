# CSE 341 Books API

A read-only Express API that serves book data from MongoDB Atlas.

## Environment Variables

This project requires a `.env` file (not committed to version control) with the following variables:

- `PORT` — the port the local server listens on (e.g. 3000)
- `MONGODB_URI` — the MongoDB Atlas connection string, including username and password
- `MONGODB_DB_NAME` — the database name (`cse341-books-db`)

**Never commit the `.env` file.** It is listed in `.gitignore` to prevent credentials from being pushed to GitHub. When deployed, these same values are configured directly in Render's Environment Variables settings instead of a `.env` file.

## Database

- Database: `cse341-books-db`
- Collection: `books`
- Each document includes: `id`, `author`, `title`, `publicationDate`

## Scripts

- `npm start` — run the server
- `npm run dev` — run the server with nodemon (auto-restart)
- `npm run lint` — check code against ESLint rules
- `npm run lint:fix` — automatically fix lint issues where possible