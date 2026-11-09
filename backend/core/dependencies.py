from dataclasses import dataclass

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import Connection

from applications.authentication.rq_rs.auth_rs import UserData
from applications.authentication.utils.auth_dbutilities import fetch_active_user
from core.exceptions import ApplicationError
from core.security import decode_access_token
from database.connection import get_connection

bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class AuthenticatedUser:
    user: UserData
    token_jti: str


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    connection: Connection = Depends(get_connection),
) -> AuthenticatedUser:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise ApplicationError("authentication_required", "Authentication is required.", 401)
    payload = decode_access_token(credentials.credentials)
    user = fetch_active_user(connection, payload["sub"], payload["jti"])
    return AuthenticatedUser(user=user, token_jti=payload["jti"])
