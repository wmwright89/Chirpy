# Chirpy

Chirpy is a backend RESTful API built for a Boot.dev backend course. It provides the server-side functionality for a microblogging platform, including user authentication (using Argon2 and JWTs with refresh tokens), chirp (post) creation and retrieval with automated content filtering, user upgrades via webhook integration, and hit metrics tracking.

## Technologies Used

- Node.js & TypeScript
- Express
- PostgreSQL
- Drizzle ORM & Drizzle Kit
- Argon2 & JSON Web Tokens (JWT)
- Vitest

## Getting Started

### Prerequisites

- Node.js (v22.14.0 or later recommended)
- npm
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/wmwright89/Chirpy.git
   cd Chirpy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory (or copy `.env.example`):

   ```bash
   cp .env.example .env
   ```

   Configure the required variables:

   ```env
   DB_URL="postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable"
   PORT=8080
   PLATFORM="dev"
   SECRET="your-jwt-secret-key"
   POLKA_KEY="your-polka-api-key"
   ```

4. Run database migrations:

   Make sure your PostgreSQL database exists, then run:

   ```bash
   npm run migrate
   ```

   *(Note: The server also automatically applies pending migrations upon startup).*

### Running the Application

- **Development Mode** (compiles TypeScript and starts the server):

  ```bash
  npm run dev
  ```

- **Production Mode** (builds to `dist` and runs compiled JavaScript):

  ```bash
  npm run build
  npm start
  ```

By default, the server runs at `http://localhost:8080`.

### Running Tests

To run the unit test suite:

```bash
npm test
```
