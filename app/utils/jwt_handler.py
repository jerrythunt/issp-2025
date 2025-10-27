import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

# =====================================================
# JWT configuration
# =====================================================
# SECRET_KEY: Used to sign and verify JWT tokens
# ALGORITHM: The cryptographic algorithm used to encode/decode the token
# ACCESS_TOKEN_EXPIRE_MINUTES: How long a token is valid
SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")  # Use a strong secret in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour

# =====================================================
# Create an access token
# =====================================================
def create_access_token(data: dict, expires_delta: int | None = None):
    """
    Creates a JWT token with user-provided data.
    
    Parameters:
    - data: Dictionary containing user info (e.g., {'uid': '123'})
    - expires_delta: Optional expiration time in minutes
    
    Returns:
    - Encoded JWT token as a string
    """
    to_encode = data.copy()  # Avoid modifying original data
    expire = datetime.utcnow() + timedelta(
        minutes=expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})  # Add expiration claim
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# =====================================================
# Decode and verify a token
# =====================================================
def decode_access_token(token: str):
    """
    Decodes a JWT token and verifies its validity.
    
    Parameters:
    - token: JWT string
    
    Returns:
    - Decoded data dictionary if valid
    - None if token is expired or invalid
    """
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.InvalidTokenError:
        # Token is invalid for any other reason
        return None
