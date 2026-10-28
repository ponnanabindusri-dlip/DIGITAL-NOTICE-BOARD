# Digital Notice Board 📌

A modern, full-stack campus announcement and digital notice board platform designed for college students and academic institutions.

## 1. Project Overview & Features
- **Categorized Announcements:** Filter notices by Academic, Events, Sports, General, and Urgent.
- **Search Functionality:** Instant search across titles, contents, and authors.
- **Notice Pinning:** Highlight critical announcements at the top of the notice board.
- **Full CRUD Support:** Create, Read, Update, and Delete notices with real-time UI response.
- **Responsive & Modern UI:** Built with clean CSS variables, cards, badges, smooth transitions, and empty state support.
- **Supabase PostgreSQL Integration:** Secure cloud database layer with Row-Level Security (RLS) policies.

---

## 2. Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Dependencies:** `@supabase/supabase-js`, `cors`, `dotenv`, `express`, `ws`, `nodemon`

---

## 3. Database & Supabase Setup
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `database/schema.sql` from this repository, paste its content into the SQL Editor, and click **Run**.
4. Retrieve your **Project URL** and **Anon Public Key** from `Project Settings > API`.

---

## 4. Environment Variables Configuration
In the `backend/` directory, create a `.env` file based on `.env.example`:

```env
PORT=5000
SUPABASE_URL=https://your-supabase-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

---

## 5. Installation & Startup Instructions

### Backend Setup
Navigate into the `backend` folder and install dependencies:

```bash
cd backend
npm install
npm install express cors dotenv @supabase/supabase-js ws
npm install --save-dev nodemon
```

Start the backend server in development mode:

```bash
npm run dev
# Or for production:
npm start
```
The server will run on `http://localhost:5000`.

### Frontend Setup
Open `frontend/index.html` directly in your browser or run it using Live Server (VS Code Extension).

---

## 6. API Endpoints
- `GET /api/health` - Health check endpoint.
- `GET /api/notices` - Fetch all notices (Supports `?category=Academic` and `?search=query`).
- `GET /api/notices/:id` - Fetch single notice by ID.
- `POST /api/notices` - Create a new notice.
- `PUT /api/notices/:id` - Update existing notice.
- `DELETE /api/notices/:id` - Delete notice.

---

## 7. Short Project Demonstration Script
1. Launch backend (`npm run dev`) and open `frontend/index.html` in browser.
2. View pre-populated notices loaded from Supabase PostgreSQL.
3. Click filter tags (Academic, Sports, Events) to demonstrate category filtering.
4. Type in the search box to test instant search.
5. Scroll down to "Post New Notice", enter details, and click **Publish Notice**.
6. Notice appears instantly at the top of the grid.
7. Click the Edit (✏️) icon to update a notice's content.
8. Click the Delete (🗑️) icon to remove a notice.

---

## 8. Five Viva Questions & Answers

**Q1: Why use Express.js and Node.js for backend API design?**  
*A:* Node.js offers an asynchronous, non-blocking I/O event loop suitable for handling lightweight REST API requests efficiently, while Express simplifies route definition and middleware handling.

**Q2: What is Row-Level Security (RLS) in Supabase/PostgreSQL?**  
*A:* RLS allows database administrators to define fine-grained security rules controlling which users can read, insert, update, or delete specific rows in a table.

**Q3: How does the Fetch API handle asynchronous HTTP requests?**  
*A:* The Fetch API uses JavaScript Promises to execute HTTP network requests asynchronously without blocking the UI main thread.

**Q4: What is the purpose of CORS middleware in Express?**  
*A:* Cross-Origin Resource Sharing (CORS) permits or restricts requested resources on a web server depending on where the HTTP request was initiated.

**Q5: How does notice pinning work in database queries?**  
*A:* Queries sort by `is_pinned DESC` first, ensuring pinned notices are ordered before standard notices regardless of creation timestamp.
