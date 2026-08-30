from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str # 'student' or 'mentor'

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    token: str
    user_id: int
    role: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
