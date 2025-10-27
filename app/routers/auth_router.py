from fastapi import APIRouter, HTTPException
from services.auth_service import signup_user, login_user

# Helps moduality 
router = APIRouter(prefix="/auth", tags=["auth"])
    
@router.post("/signup")
# From services/auth_service
def signup(email: str, password: str, display_name: str = None):
    result, status = signup_user(email, password, display_name)
    # Raises HTTPException to pass error to frontend.
    if status != 200:
        raise HTTPException(status_code=status, detail=result)
    # If successful, returns UID, Firebase ID token, and app JWT.
    return result

@router.post("/login")
# Calls login_user from services.auth_service.
def login(email: str, password: str):
    result, status = login_user(email, password)
    # raises HTTPException to pass error to frontend.
    if status != 200:
        raise HTTPException(status_code=status, detail=result)
    # returns UID and Firebase ID token.
    return result
