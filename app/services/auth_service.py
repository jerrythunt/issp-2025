import os
import requests
from app.utils.firebase import db, firestore  # Firestore client and constants
from app.utils.jwt_handler import create_access_token  # JWT helper
from dotenv import load_dotenv

# Optional here because firebase.py already loads them,
# but safe to ensure FIREBASE_API_KEY is available.
load_dotenv()

#  Public facing, client side access loaded from .env
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
if not FIREBASE_API_KEY:
    raise ValueError("FIREBASE_API_KEY missing in .env")


# Firebase REST API endpoints
# These are the endpoints for signing up and logging in users
# via Firebase Authentication using email & password.
SIGN_UP_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}"
SIGN_IN_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

# Signup function
def signup_user(email: str, password: str, display_name: str = None):
    # Firebase requires a JSON payload for email/password signup
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    response = requests.post(SIGN_UP_URL, json=payload)

    # If Firebase returns an error, forward it to the frontend
    if response.status_code != 200:
        return {"error": response.json()}, response.status_code

    # Successful signup
    data = response.json()

    # Store additional user info in Firestore, still need to decide fully
    user_doc = db.collection(f"{data['localId']}-auth").document("profile")
    user_doc.set({
        "email": email,
        "display_name": display_name or "",
        # Firebase server timestamp
        "created_at": firestore.SERVER_TIMESTAMP
    })


    # Generate JWT token for the app
    # This token is separate from Firebase ID token and used
    # for session handling within our FastAPI backend.
    access_token = create_access_token({"uid": data["localId"], "email": email})

    return {
        "uid": data["localId"],
        "idToken": data["idToken"],  # Firebase ID token
        "access_token": access_token  # App-specific JWT
    }, 200

# Login function
def login_user(email: str, password: str):
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    response = requests.post(SIGN_IN_URL, json=payload)

    # If Firebase returns an error, forward it to the frontend
    if response.status_code != 200:
        return {"error": response.json()}, response.status_code

    # Successful login
    data = response.json()

    # Only returning Firebase UID and ID token here
    # optionally could also generate app JWT like signup_user.
    return {
        "uid": data["localId"],
        "idToken": data["idToken"]
    }, 200
