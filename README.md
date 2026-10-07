# Smart Study — React + Spring Boot + Hibernate

A responsive full-stack study application for creating study decks from notes, browsing flashcards, taking quizzes, and saving scores.

## Stack

- Frontend: React 18 + Vite + plain CSS
- Backend: Java 17 + Spring Boot 3 + Spring Web + Spring Data JPA/Hibernate
- Database: PostgreSQL (recommended for deployment)
- Development database: H2
- No login/authentication/JWT/security layer
- REST API between React and Spring Boot

## Features

1. Dashboard with saved decks and statistics
2. Create a deck from:
   - topic + notes, using the built-in smart generator
   - manually entered flashcards
3. Flashcard flip interaction
4. Quiz with multiple-choice questions
5. Score saved to PostgreSQL/H2
6. Delete decks
7. Responsive floral UI with subtle animations
8. CORS configuration for local development and deployment
9. Render deployment files and Vercel frontend configuration

> Note: The "smart generator" is deliberately local and deterministic so the project needs no AI API key. It turns note sentences into flashcards and quiz questions. If a hackathon requires a real LLM, the generator service can later be replaced with an API integration without changing the React/database structure.

---

# 1. Project structure

```text
smart-study-app/
├── backend/
│   ├── pom.xml
│   ├── render.yaml
│   └── src/main/
│       ├── java/com/smartstudy/
│       │   ├── SmartStudyApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── controller/DeckController.java
│       │   ├── controller/QuizController.java
│       │   ├── dto/
│       │   ├── model/
│       │   ├── repository/
│       │   └── service/
│       └── resources/application.properties
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api.js
│       ├── styles.css
│       └── components/
└── README.md
```

---

# 2. How frontend connects to backend

The flow is:

```text
React UI
   ↓
api.js (fetch)
   ↓ HTTP GET/POST/DELETE
Spring Boot REST Controller
   ↓
Service
   ↓
Spring Data JPA
   ↓
Hibernate
   ↓
PostgreSQL / H2
```

Example:

```js
fetch("http://localhost:8080/api/decks")
```

Spring receives it:

```java
@GetMapping
public List<Deck> getDecks()
```

The repository uses JPA:

```java
deckRepository.findAll()
```

Hibernate converts that Java operation into SQL and talks to PostgreSQL.

---

# 3. Run locally in VS Code

## Requirements

Install:

- Java 17+
- Maven 3.9+
- Node.js 20+
- VS Code
- PostgreSQL (optional for local development because H2 is included)

Check:

```bash
java -version
mvn -version
node -v
npm -v
```

## Start backend

Open a terminal:

```bash
cd backend
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

The default development database is H2.

H2 console:

```text
http://localhost:8080/h2-console
```

Use:

```text
JDBC URL: jdbc:h2:file:./data/smartstudy
User: sa
Password: leave blank
```

## Start frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

---

# 4. PostgreSQL locally

Create a database:

```sql
CREATE DATABASE smartstudy;
```

Then set environment variables before starting Spring Boot.

Windows PowerShell:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/smartstudy"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
mvn spring-boot:run
```

macOS/Linux:

```bash
export DB_URL="jdbc:postgresql://localhost:5432/smartstudy"
export DB_USERNAME="postgres"
export DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
mvn spring-boot:run
```

Spring Boot will automatically create/update the tables with Hibernate.

---

# 5. Main API endpoints

### Decks

```text
GET    /api/decks
GET    /api/decks/{id}
POST   /api/decks
DELETE /api/decks/{id}
```

### Generate a deck

```text
POST /api/decks/generate
```

Body:

```json
{
  "title": "Java Basics",
  "topic": "Java",
  "notes": "Java is object oriented. Classes define objects. Inheritance allows reuse."
}
```

### Quiz

```text
GET  /api/decks/{id}/quiz
POST /api/decks/{id}/scores
```

---

# 6. GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial Smart Study full stack application"
```

Create an empty GitHub repository, then:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-study-app.git
git push -u origin main
```

Do not commit real passwords.

---

# 7. Deploy backend + database to Render

The backend folder includes `render.yaml`.

### Recommended simple approach

1. Push the whole project to GitHub.
2. Go to Render.
3. Create a PostgreSQL database.
4. Create a Web Service from your GitHub repository.
5. Set Root Directory to:

```text
backend
```

6. Build command:

```text
mvn clean package -DskipTests
```

7. Start command:

```text
java -jar target/smart-study-backend-1.0.0.jar
```

8. Add environment variables:

```text
DB_URL=jdbc:postgresql://<render-host>:5432/<database>
DB_USERNAME=<database-user>
DB_PASSWORD=<database-password>
CORS_ALLOWED_ORIGINS=https://YOUR-VERCEL-APP.vercel.app
```

Render provides the PostgreSQL connection details.

Your backend URL will look like:

```text
https://your-backend.onrender.com
```

---

# 8. Deploy frontend to Vercel

1. Go to Vercel.
2. Import your GitHub repository.
3. Set Root Directory:

```text
frontend
```

4. Build command:

```text
npm run build
```

5. Output directory:

```text
dist
```

6. Add environment variable:

```text
VITE_API_URL=https://your-backend.onrender.com/api
```

7. Deploy.

The included `vercel.json` handles SPA routes.

---

# 9. Alternative: Netlify

For Netlify:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment variable:

```text
VITE_API_URL=https://your-backend.onrender.com/api
```

The backend should still be hosted on Render because Spring Boot needs a Java server.

---

# 10. Important hackathon explanation

If judges ask how the connection works:

> React is the presentation layer. It sends HTTP requests to Spring Boot REST APIs. Spring Boot controllers receive the requests and pass them to services. Spring Data JPA uses Hibernate as the ORM layer. Hibernate converts Java entities and repository operations into SQL, which is executed against PostgreSQL. The response comes back as JSON and React updates the UI.

Short version:

```text
React → REST API → Spring Controller → Service → JPA/Hibernate → PostgreSQL
                                      ← JSON ←
```

---

# 11. No security

This project intentionally does NOT include:

- Spring Security
- JWT
- login
- signup
- password handling
- OAuth

That makes it appropriate for a simple hackathon prototype. For a production public application, authentication and authorization should be added later.

