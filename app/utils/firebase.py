import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Loading environment variables from the project root
# This allows us to avoid hardcoding sensitive data like the Firebase service account key or API key
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(PROJECT_ROOT, ".env"))


# Retrieve Firebase service account filename from .env
# The service account JSON contains credentials for admin access to Firebase services like Firestore or Auth
SERVICE_ACCOUNT_FILENAME = os.getenv("FIREBASE_SERVICE_ACCOUNT")
if not SERVICE_ACCOUNT_FILENAME:
    raise ValueError("FIREBASE_SERVICE_ACCOUNT missing in .env")


# Absolute path to the JSON key
# This converts the relative path from .env into an absolute path so Python can locate the file regardless of where the script is run
SERVICE_ACCOUNT_PATH = os.path.abspath(os.path.join(PROJECT_ROOT, SERVICE_ACCOUNT_FILENAME))

# Make sure the JSON key exists
if not os.path.exists(SERVICE_ACCOUNT_PATH):
    raise FileNotFoundError(f"SERVICE_ACCOUNT_PATH not found at: {SERVICE_ACCOUNT_PATH}")

# Initialize Firebase Admin SDK (gives us admin access to Firebase services from our backend)
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)


# Create Firestore client
# The 'db' object allows us to read and write data to Firestore.
# Example usage in services: db.collection("users").document(uid).set({...})
db = firestore.client()

## Test if you can connect
# if __name__ == "__main__":
#     try:
#         # Reference a test collection and document
#         test_ref = db.collection("test_connection").document("ping")

#         # Write a simple test document
#         test_ref.set({"status": "ok"})
#         print("✅ Successfully wrote test document!")

#         # Read it back
#         doc = test_ref.get()
#         if doc.exists:
#             print("✅ Successfully read document:", doc.to_dict())
#         else:
#             print("⚠️ Document not found")

#     except Exception as e:
#         print("❌ Firebase connection failed:", e)
