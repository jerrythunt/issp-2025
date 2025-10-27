# USER ENPOINTS

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.auth_service import signup_user, login_user

# Add prefix to make coding modular
router = APIRouter(prefix="/users", tags=["users"])

# Request body models
class UserSignup(BaseModel):
    email: str
    password: str
    display_name: str | None = None

class UserLogin(BaseModel):
    email: str
    password: str

# Sign up route
@router.post("/signup")
async def signup(user: UserSignup):
    result, status = signup_user(user.email, user.password, user.display_name)
    # raises HTTPException so frontend gets proper HTTP response
    if status != 200:
        raise HTTPException(status_code=status, detail=result)
    # Returns Firebase UID, ID token, and JWT token
    return result

# Login route
@router.post("/login")
async def login(user: UserLogin):
    result, status = login_user(user.email, user.password)
    # returns an error, raises HTTPException.
    if status != 200:
        raise HTTPException(status_code=status, detail=result)
    # Returns Firebase UID and ID token
    return result
