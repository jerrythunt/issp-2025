from fastapi import APIRouter, Depends, HTTPException, Request
from app.routers.users import verify_token
from app.utils.firebase import db

router = APIRouter(prefix="/playlists", tags=["playlists"])

@router.get("/")
async def get_playlists(user=Depends(verify_token)):
    """
    Return all playlists for the authenticated user.
    """
    uid = user["uid"]
    playlists_ref = db.collection("playlists").where("owner_uid", "==", uid)
    playlists = [doc.to_dict() for doc in playlists_ref.stream()]
    return {"playlists": playlists}

@router.post("/")
async def create_playlist(name: str, user=Depends(verify_token)):
    """
    Create a new playlist for the authenticated user.
    """
    uid = user["uid"]
    new_playlist = {
        "name": name,
        "owner_uid": uid,
        "songs": []
    }
    db.collection("playlists").add(new_playlist)
    return {"message": "Playlist created", "playlist": new_playlist}
