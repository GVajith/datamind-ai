from collections.abc import Iterator

from sqlalchemy import Connection, create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.pool import StaticPool

from core.config import settings


def build_engine(database_url: str | None = None) -> Engine:
    url = database_url or settings.database_url
    options: dict = {"pool_pre_ping": True}
    if url == "sqlite://":
        options.update(
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    elif url.startswith("sqlite"):
        options["connect_args"] = {"check_same_thread": False}
    return create_engine(url, **options)


engine = build_engine()


def get_connection() -> Iterator[Connection]:
    with engine.begin() as connection:
        yield connection
