import secrets
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from sqlalchemy import Connection, and_, insert, select, update

from applications.authentication.rq_rs.auth_rq import LoginRq, RegisterRq, ResetPasswordRq
from applications.authentication.rq_rs.auth_rs import AuthData, UserData
from core.config import settings
from core.exceptions import ApplicationError
from core.security import (
    create_access_token,
    hash_password,
    hash_reset_token,
    verify_password,
)
from database.tables import auth_sessions, password_reset_tokens, users

DUMMY_PASSWORD_HASH = hash_password("NotARealPassword1!")


def normalize_email(email: str) -> str:
    return email.strip().lower()


def _user_data(row) -> UserData:
    return UserData(
        user_id=row.user_id,
        full_name=row.full_name,
        email=row.email,
        role=row.role,
        created_at=row.created_at,
    )


def _create_session(connection: Connection, user_row) -> AuthData:
    token, token_jti, expires_at = create_access_token(user_row.user_id, user_row.role)
    connection.execute(
        insert(auth_sessions).values(
            session_id=str(uuid4()),
            user_id=user_row.user_id,
            token_jti=token_jti,
            expires_at=expires_at,
        )
    )
    return AuthData(
        access_token=token,
        expires_in=settings.access_token_expire_minutes * 60,
        user=_user_data(user_row),
    )


def register_user(connection: Connection, request: RegisterRq) -> AuthData:
    email = normalize_email(str(request.email))
    existing = connection.execute(select(users.c.user_id).where(users.c.email == email)).first()
    if existing:
        raise ApplicationError("email_exists", "An account with this email already exists.", 409)

    user_id = str(uuid4())
    connection.execute(
        insert(users).values(
            user_id=user_id,
            full_name=request.full_name,
            email=email,
            password_hash=hash_password(request.password),
            role="user",
            is_active=True,
        )
    )
    user_row = connection.execute(select(users).where(users.c.user_id == user_id)).one()
    return _create_session(connection, user_row)


def authenticate_user(connection: Connection, request: LoginRq) -> AuthData:
    email = normalize_email(str(request.email))
    user_row = connection.execute(select(users).where(users.c.email == email)).first()
    password_hash = user_row.password_hash if user_row else DUMMY_PASSWORD_HASH
    valid_password = verify_password(request.password, password_hash)
    if not user_row or not valid_password:
        raise ApplicationError("invalid_credentials", "Email or password is incorrect.", 401)
    if not user_row.is_active:
        raise ApplicationError("account_inactive", "This account is inactive.", 403)
    return _create_session(connection, user_row)


def fetch_active_user(connection: Connection, user_id: str, token_jti: str) -> UserData:
    now = datetime.now(UTC)
    query = (
        select(users)
        .join(auth_sessions, auth_sessions.c.user_id == users.c.user_id)
        .where(
            and_(
                users.c.user_id == user_id,
                users.c.is_active.is_(True),
                auth_sessions.c.token_jti == token_jti,
                auth_sessions.c.revoked_at.is_(None),
                auth_sessions.c.expires_at > now,
            )
        )
    )
    user_row = connection.execute(query).first()
    if not user_row:
        raise ApplicationError("invalid_session", "Authentication session is no longer active.", 401)
    return _user_data(user_row)


def revoke_session(connection: Connection, token_jti: str) -> None:
    result = connection.execute(
        update(auth_sessions)
        .where(and_(auth_sessions.c.token_jti == token_jti, auth_sessions.c.revoked_at.is_(None)))
        .values(revoked_at=datetime.now(UTC))
    )
    if result.rowcount == 0:
        raise ApplicationError("invalid_session", "Authentication session is no longer active.", 401)


def create_password_reset(connection: Connection, email: str) -> str | None:
    user_row = connection.execute(select(users).where(users.c.email == normalize_email(email))).first()
    if not user_row or not user_row.is_active:
        return None
    raw_token = secrets.token_urlsafe(48)
    connection.execute(
        insert(password_reset_tokens).values(
            reset_id=str(uuid4()),
            user_id=user_row.user_id,
            token_hash=hash_reset_token(raw_token),
            expires_at=datetime.now(UTC) + timedelta(minutes=settings.password_reset_expire_minutes),
        )
    )
    return raw_token


def reset_password(connection: Connection, request: ResetPasswordRq) -> None:
    now = datetime.now(UTC)
    token_row = connection.execute(
        select(password_reset_tokens).where(
            and_(
                password_reset_tokens.c.token_hash == hash_reset_token(request.token),
                password_reset_tokens.c.used_at.is_(None),
                password_reset_tokens.c.expires_at > now,
            )
        )
    ).first()
    if not token_row:
        raise ApplicationError("invalid_reset_token", "Reset token is invalid or expired.", 400)

    connection.execute(
        update(users)
        .where(users.c.user_id == token_row.user_id)
        .values(password_hash=hash_password(request.password), updated_at=now)
    )
    connection.execute(
        update(password_reset_tokens)
        .where(password_reset_tokens.c.reset_id == token_row.reset_id)
        .values(used_at=now)
    )
    connection.execute(
        update(auth_sessions)
        .where(and_(auth_sessions.c.user_id == token_row.user_id, auth_sessions.c.revoked_at.is_(None)))
        .values(revoked_at=now)
    )
