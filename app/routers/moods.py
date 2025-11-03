from fastapi import APIRouter, Depends, HTTPException
from app.routers.users import verify_token
from app.utils.firebase import db
from datetime import datetime

router = APIRouter(prefix="/moods", tags=["moods"])

@router.post("/")
async def record_mood(mood: str, user=Depends(verify_token)):
    """
    Record the user's mood with a timestamp.
    """
    uid = user["uid"]
    mood_entry = {
        "uid": uid,
        "mood": mood,
        "timestamp": datetime.utcnow()
    }
    db.collection("moods").add(mood_entry)
    return {"message": "Mood recorded", "entry": mood_entry}

@router.get("/")
async def get_moods(user=Depends(verify_token)):
    """
    Retrieve all mood entries for the authenticated user.
    """
    uid = user["uid"]
    moods_ref = db.collection("moods").where("uid", "==", uid)
    moods = [doc.to_dict() for doc in moods_ref.stream()]
    return {"moods": moods}
