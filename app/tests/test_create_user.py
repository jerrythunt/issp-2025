import os
import requests
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables from .env in parent folder
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT")

# Fix path to service account JSON
SERVICE_ACCOUNT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..",SERVICE_ACCOUNT_PATH))
print(f"[DEBUG] Using service account path: {SERVICE_ACCOUNT_PATH}")

if not FIREBASE_API_KEY:
    raise ValueError("FIREBASE_API_KEY missing from .env")
if not SERVICE_ACCOUNT_PATH or not os.path.exists(SERVICE_ACCOUNT_PATH):
    raise ValueError(f"SERVICE_ACCOUNT_PATH missing or file not found at: {SERVICE_ACCOUNT_PATH}")

# Initialize Firebase Admin (for Firestore)
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)
    print("[DEBUG] Firebase Admin initialized")

db = firestore.client()

def create_firebase_user(email: str, password: str, display_name: str = None):
    """
    Mimics the React frontend creating a user via Firebase Auth and storing info in Firestore
    """
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    print(f"[DEBUG] Sending create user request for: {email}")
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ User created successfully!")
        print(f"[DEBUG] UID: {data['localId']}")
        print(f"[DEBUG] ID Token (first 20 chars): {data['idToken'][:20]}...")

        # Store additional info in Firestore
        user_doc_ref = db.collection(f"{data['localId']}-auth").document("profile")
        user_data = {
            "email": email,
            "display_name": display_name or "",
            "created_at": firestore.SERVER_TIMESTAMP
        }
        user_doc_ref.set(user_data)
        print(f"[DEBUG] User data stored in Firestore under collection: {data['localId']}-auth")
        return data
    else:
        print(f"❌ Failed to create user: {response.status_code} - {response.text}")
        return None

if __name__ == "__main__":
    test_email = "testing123@email.com"
    test_password = "abcd0123"
    test_name = "Test User"
    create_firebase_user(test_email, test_password, test_name)
