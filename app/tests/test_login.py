import os
import requests
# Allows for loading from .env to avoid hardcoding sensitive data
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# This is the key for users to login
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")

if not FIREBASE_API_KEY:
    raise ValueError("FIREBASE_API_KEY not set in .env")

print(f"[DEBUG] Using Firebase API Key: {FIREBASE_API_KEY[:10]}...")

# Test credentials
email = "test123@test.com"
password = "test1234"

# Firebase REST endpoint for email/password sign-in
sign_in_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

# Simualte JSON payload
payload = {
    "email": email,
    "password": password,
    "returnSecureToken": True
}

print(f"[Sending sign-in request for user: {email}")
response = requests.post(sign_in_url, json=payload)
data = response.json()

if response.status_code == 200:
    id_token = data["idToken"]
    refresh_token = data["refreshToken"]
    local_id = data["localId"]
    print("Successfully signed in!")
    print(f"[DEBUG] ID Token (first 20 chars...): {id_token[:20]}...")
    print(f"[DEBUG] Refresh Token (first 20 chars...): {refresh_token[:20]}...")
    print(f"[DEBUG] Local UID...: {local_id}")
else:
    print("Sign-in failed!")
    print(f"Status code: {response.status_code}")
    print(f"Response: {data}")
