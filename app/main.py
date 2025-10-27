from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users  # Import the users router
from app.utils.firebase import db  # Import Firestore client (initializes Firebase Admin)

# Create FastAPI app instance
# This is the main entry point of the backend.
app = FastAPI(title="ISSP 2025 FastAPI Firebase API")

# CORS (Cross-Origin Resource Sharing)
# React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # e.g., ["http://localhost:3000"] for local React dev
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers (authorization, content-type, etc.)
)

# Include routers
# Routers group related endpoints together
# Here we include the `users` router, which handles /users/signup and /users/login
app.include_router(users.router)


# Root endpoint, confirmation that it's running
@app.get("/")
async def root():
    return {"message": "FastAPI Firebase API running!"}
