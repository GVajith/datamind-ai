from fastapi import APIRouter, Depends, status
from sqlalchemy import Connection

from applications.authentication.rq_rs.auth_rq import (
    ForgotPasswordRq,
    LoginRq,
    RegisterRq,
    ResetPasswordRq,
)
from applications.authentication.rq_rs.auth_rs import AuthResponse, UserResponse
from applications.authentication.utils.auth_dbutilities import (
    authenticate_user,
    create_password_reset,
    register_user,
    reset_password,
    revoke_session,
)
from common.classes.generic import ApiResponse
from core.config import settings
from core.dependencies import AuthenticatedUser, get_current_user
from database.connection import get_connection

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])


@auth_router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRq, connection: Connection = Depends(get_connection)) -> AuthResponse:
    auth_data = register_user(connection, request)
    return AuthResponse(sts=True, msg="Account created successfully.", data=auth_data)


@auth_router.post("/login", response_model=AuthResponse)
def login(request: LoginRq, connection: Connection = Depends(get_connection)) -> AuthResponse:
    auth_data = authenticate_user(connection, request)
    return AuthResponse(sts=True, msg="Signed in successfully.", data=auth_data)


@auth_router.post("/logout", response_model=ApiResponse)
def logout(
    principal: AuthenticatedUser = Depends(get_current_user),
    connection: Connection = Depends(get_connection),
) -> ApiResponse:
    revoke_session(connection, principal.token_jti)
    return ApiResponse(sts=True, msg="Signed out successfully.")


@auth_router.get("/me", response_model=UserResponse)
def me(principal: AuthenticatedUser = Depends(get_current_user)) -> UserResponse:
    return UserResponse(sts=True, msg="User profile retrieved.", data=principal.user)


@auth_router.post("/forgot-password", response_model=ApiResponse)
def forgot_password(
    request: ForgotPasswordRq,
    connection: Connection = Depends(get_connection),
) -> ApiResponse:
    reset_token = create_password_reset(connection, str(request.email))
    development_data = (
        {"reset_token": reset_token}
        if reset_token and settings.app_env in {"development", "test"}
        else None
    )
    return ApiResponse(
        sts=True,
        msg="If an active account exists, password reset instructions have been sent.",
        data=development_data,
    )


@auth_router.post("/reset-password", response_model=ApiResponse)
def update_password(
    request: ResetPasswordRq,
    connection: Connection = Depends(get_connection),
) -> ApiResponse:
    reset_password(connection, request)
    return ApiResponse(sts=True, msg="Password reset successfully. Please sign in again.")
