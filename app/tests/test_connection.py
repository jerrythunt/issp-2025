from app.utils.firebase import db

def test_firestore_connection():
    try:
        collections = list(db.collections())
        print("Collections:", [c.id for c in collections])
        assert True  # indicate test passed
    except Exception:
        assert False, "Failed to connect to Firestore"


if __name__ == "__main__":
    test_firestore_connection()
