# YouTube Clone Project

This is a YouTube-like video platform project with viewer and editor/admin roles. It includes features like user authentication, video publishing, watch history, and content management.

---

# Admin login email pass 
-- ash@gmail.com 
-- ash@123

# editor login email pass 
-- ayush@gmail.com 
-- ayush@123

# Viewer login email pass 
-- ayush2@gmail.com 
-- ayush2@123

## Backend Setup

# 1. Clone the repository and navigate to backend
git clone <your-repo-url>
cd backend

# 2. Install dependencies
npm install

# 3. Seed the Admin user (optional but recommended)
npm run seedAdmin
# This will create a default admin account in MongoDB

# 4. Create a `.env` file in backend root and configure
# PORT=4000
# MONGO_URI=<your_mongodb_connection_string>
# JWT_SECRET=<your_jwt_secret>

# 5. Run the backend server
npm run dev
# Server should start at http://localhost:4000

---

## Frontend Setup

# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Run the frontend server
npm run dev
# Frontend should start at http://localhost:5173

---

## Features

# - User Authentication (JWT-based)
#   - Viewer and Editor/Admin roles
# - Video Publishing
# - Watch History
# - Post Management
# - Responsive Design (Desktop & Mobile)

---

## Notes

# - Make sure MongoDB is running locally or use a cloud MongoDB instance.
# - Frontend is configured to connect to backend via Axios. Update the API base URL in `frontend/src/api/api.js` if needed.
# - Viewer accounts automatically post content as published.
# - Editor/Admin accounts can manage all posts (create, edit, delete).

---

## Contact

# For any questions or issues, contact Aayush Singh at ayush2002si@gmail.com
