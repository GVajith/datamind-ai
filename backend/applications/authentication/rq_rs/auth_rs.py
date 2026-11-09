from datetime import datetime

from pydantic import BaseModel, EmailStr

from common.classes.generic import ApiResponse


class UserData(BaseModel):
    user_id: str
    full_name: str
    email: EmailStr
    role: str
    created_at: datetime


class AuthData(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserData


class AuthResponse(ApiResponse):
    data: AuthData | None = None


class UserResponse(ApiResponse):
    data: UserData | None = None
