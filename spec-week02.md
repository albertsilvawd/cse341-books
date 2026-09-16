# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Add a new `authors` collection that stores author records, and provide full CRUD operations for authors. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters, following the same pattern used for books.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a4",
      "name": "Example Author",
      "birthYear": 1980
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "Updated Author",
      "birthYear": 1981
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has one or more books referencing them (delete is blocked)
- `500` if an unexpected server or database error occurs

### Deletion Behavior
Before deleting an author, the API checks whether any book document has an `authorId` matching that author's `id`. If one or more books reference the author, the delete request is rejected with a `409` status code and a safe JSON message. This prevents books from being left with a reference to an author that no longer exists.

### Swagger Documentation
Swagger must document every author route, including request body schemas and examples for `POST /authors` and `PUT /authors/:id`.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

# Books API Week 02 Spec - Version 2 (Evaluation & Improvements)

## Evaluation Questions and Findings

**Are there any bugs or short-sighted decisions in this specification?**
Version 1 did not define what happens if `birthYear` is submitted as a non-numeric value (e.g. a string) or an unreasonable value (e.g. a future year). This could let bad data into the database.

**Are there any security considerations that are missing?**
Version 1 did not explicitly state that raw MongoDB errors must never be returned to the client. This is required by the course coding standards and should be stated explicitly in the spec, not just assumed.

**Are there any efficiency concerns with the current endpoint design?**
Validating `authorId` on every book create/update requires an extra query to the `authors` collection. This is an acceptable and intentional tradeoff at this stage of the course (data integrity over raw performance), but it is called out here as a conscious design decision rather than an oversight.

**Are any response examples or error behaviors unclear?**
Version 1 did not include concrete JSON examples for success and error responses. Version 2 adds these below.

## Changes in Version 2

1. Added explicit type validation for `birthYear` (must be a number) in addition to checking that it is present.
2. Added an explicit rule: the API never returns raw MongoDB error details to the client; all 500 responses use a generic safe message, and the real error is only logged on the server.
3. Documented the authorId-lookup tradeoff (data integrity over query efficiency) as an intentional decision.
4. Added concrete JSON response examples for both books and authors, for success and error cases.

## Concrete Response Examples

### POST /books - success (201)
```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

### POST /books - authorId does not exist (400)
```json
{
  "message": "authorId does not match an existing author."
}
```

### DELETE /books/:id - not found (404)
```json
{
  "message": "Book not found."
}
```

### POST /authors - success (201)
```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1980
}
```

### POST /authors - missing/invalid field (400)
```json
{
  "message": "Missing or invalid required author fields."
}
```

### DELETE /authors/:id - author still has books (409)
```json
{
  "message": "Author cannot be deleted because they still have books."
}
```

### Any route - unexpected server error (500)
```json
{
  "message": "Internal server error."
}
```
Note: This generic message is always returned for 500 errors. The real error (including any MongoDB-specific details) is logged on the server with `console.error`, never sent to the client.
