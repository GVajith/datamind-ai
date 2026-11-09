from fastapi import FastAPI

from applications.authentication.routes.auth_router import auth_router


def add_routes(app: FastAPI, prefix: str = "") -> None:
    app.include_router(auth_router, prefix=prefix)
