from fastapi import APIRouter, Depends, HTTPException
from app.routers.users import verify_token
from app.utils.firebase import db
import requests, os
from dotenv import load_dotenv

router = APIRouter(prefix="/songs", tags=["Songs"])

load_dotenv()
LASTFM_API_KEY = os.getenv("LASTFM_API_KEY")

@router.post("/songs/import")
def import_songs_from_lastfm():
    url = f"http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key={LASTFM_API_KEY}&format=json"
    response = requests.get(url)
    data = response.json()

    tracks = data["tracks"]["track"]
    batch = db.batch()

    for t in tracks:
        song_data = {
            "title": t["name"],
            "artist": t["artist"]["name"],
            "url": t["url"],
            "playcount": t["playcount"],
            "image": t["image"][2]["#text"] if len(t["image"]) > 2 else None,
        }

        # Use title+artist as unique key
        doc_id = f"{t['name']}_{t['artist']['name']}".replace("/", "-")
        ref = db.collection("music_library").document(doc_id)
        batch.set(ref, song_data)

    batch.commit()
    return {"status": "success", "count": len(tracks)}
