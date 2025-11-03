# USER ENPOINTS

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.auth_service import signup_user, login_user

# Add prefix to make coding modular
router = APIRouter(prefix="/users", tags=["users"])

from fastapi import APIRouter, HTTPException, Depends, Request
from firebase_admin import auth

router = APIRouter(prefix="/users", tags=["users"])

async def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    id_token = auth_header.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@router.post("/verify-token")
async def verify_user(user=Depends(verify_token)):
    return {
        "uid": user["uid"],
        "email": user.get("email"),
        "display_name": user.get("name"),
        "message": "Token verified successfully"
    }

@router.get("/profile")
async def get_profile(user=Depends(verify_token)):
    return {
        "uid": user["uid"],
        "email": user.get("email"),
        "display_name": user.get("name"),
        "message": "Protected profile data."
    }


















# # Request body models
# class UserSignup(BaseModel):
#     email: str
#     password: str
#     display_name: str | None = None

# class UserLogin(BaseModel):
#     email: str
#     password: str

# # Sign up route
# @router.post("/signup")
# async def signup(user: UserSignup):
#     result, status = signup_user(user.email, user.password, user.display_name)
#     # raises HTTPException so frontend gets proper HTTP response
#     if status != 200:
#         raise HTTPException(status_code=status, detail=result)
#     # Returns Firebase UID, ID token, and JWT token
#     return result

# # Login route
# @router.post("/login")
# async def login(user: UserLogin):
#     result, status = login_user(user.email, user.password)
#     # returns an error, raises HTTPException.
#     if status != 200:
#         raise HTTPException(status_code=status, detail=result)
#     # Returns Firebase UID and ID token
#     return result
