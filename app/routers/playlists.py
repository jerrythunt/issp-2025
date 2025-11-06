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

@router.delete("/{playlist_id}")
async def delete_playlist(playlist_id: str, user=Depends(verify_token)):
    uid = user["uid"]

    # Reference to the playlist document
    playlist_ref = db.collection("playlists").document(playlist_id)
    playlist_doc = playlist_ref.get()

    # Check if playlist exists
    if not playlist_doc.exists:
        raise HTTPException(status_code=404, detail="Playlist not found")

    playlist_data = playlist_doc.to_dict()

    # Check ownership
    if playlist_data.get("owner_uid") != uid:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this playlist")

    # Delete the playlist
    playlist_ref.delete()

    return {"message": f"Playlist '{playlist_data.get('name')}' deleted successfully"}

