import requests
import json

# -------------------------
# CONFIG: Firebase & FastAPI

FIREBASE_API_KEY="AIzaSyColSU4_gEGgZ2vj7QuzQ9ELV3wpBbOC20"
EMAIL = "test123@test.com"
PASSWORD = "test1234"
FASTAPI_BASE_URL = "http://localhost:8000"

# Get Firebase ID Token
def get_firebase_id_token(email, password, api_key):
    # Check API key
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    # insert payload info
    payload = {"email": email, "password": password, "returnSecureToken": True}
    response = requests.post(url, data=json.dumps(payload))
    response.raise_for_status()
    id_token = response.json()["idToken"]
    print(f'-\nToken retrieved:\n{id_token}\n-')
    return id_token

# Call FastAPI endpoints
def call_fastapi(method, endpoint, token, params=None):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    url = f"{FASTAPI_BASE_URL}{endpoint}"
    response = requests.request(method, url, headers=headers, params=params)
    return response.json()

# MAIN TEST FLOW
if __name__ == "__main__":
    try:
        # Step 1: Get Firebase token
        token = get_firebase_id_token(EMAIL, PASSWORD, FIREBASE_API_KEY)
        print("✅ Firebase ID Token retrieved!\n")

        # Step 2: Verify token
        verify = call_fastapi("POST", "/users/verify-token", token)
        print("✅ /users/verify-token response:")
        print(json.dumps(verify, indent=2), "\n")

        # Step 3: Access protected profile endpoint
        profile = call_fastapi("GET", "/users/profile", token)
        print("✅ /users/profile response:")
        print(json.dumps(profile, indent=2), "\n")

        # Step 4: Playlists endpoints
        # List playlists
        playlists = call_fastapi("GET", "/playlists/", token)
        print("✅ /playlists/ (list) response:")
        print(json.dumps(playlists, indent=2), "\n")

        # Create a new playlist
        new_playlist_name = "Test Playlist"
        created_playlist = call_fastapi("POST", f"/playlists/?name={new_playlist_name}", token)
        print("✅ /playlists/ (create) response:")
        print(json.dumps(created_playlist, indent=2), "\n")

        # Step 5: Moods endpoints
        # Record a mood
        mood = "Happy"
        recorded_mood = call_fastapi("POST", f"/moods/?mood={mood}", token)
        print("✅ /moods/ (record) response:")
        print(json.dumps(recorded_mood, indent=2), "\n")

        # List moods
        moods = call_fastapi("GET", "/moods/", token)
        print("✅ /moods/ (list) response:")
        print(json.dumps(moods, indent=2), "\n")

    except requests.HTTPError as e:
        print("HTTP Error:", e.response.text)
    except Exception as e:
        print("Error:", str(e))
