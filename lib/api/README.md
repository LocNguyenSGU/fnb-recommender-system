# API layer

Base URL is set via `NEXT_PUBLIC_API_URL` (default: `/api` for browser, `http://localhost:3000/api` for server).

## User / Auth

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST   | `/auth/login`   | Body: `{ email, password }`. Returns `{ user, accessToken }`. |
| POST   | `/auth/logout`  | Optional: invalidate session. |
| GET    | `/auth/me`      | Returns current user (requires `Authorization: Bearer <token>`). |
| POST   | `/auth/register`| Body: `{ email, password, name }`. Returns `{ user, accessToken }`. |
| PATCH  | `/users/me`     | Body: `{ name?, avatar? }`. Returns updated user. |
| GET    | `/users/:id`    | Returns user by id. |

## Blogs

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET    | `/blogs`       | Query: `page`, `pageSize`, `search?`, `status?`. Returns `{ posts, totalCount }`. |
| GET    | `/blogs/:id`   | Returns single blog. |
| POST   | `/blogs`       | Body: `{ title, content, images?, status? }`. Requires auth. |
| PATCH  | `/blogs/:id`   | Body: `{ title?, content?, images?, status? }`. Requires auth. |
| DELETE | `/blogs/:id`   | Requires auth. |

The client sends `Authorization: Bearer <token>` when the user is logged in (token is read from the persisted auth store).
