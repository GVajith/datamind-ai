import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from applications.authentication.authentication import add_routes as add_authentication_routes
from common.classes.generic import HealthData, HealthResponse
from core.config import settings
from core.exceptions import ApplicationError
from core.logging import request_logging_middleware

logger = logging.getLogger("datamind-api-v1")


def configure_application() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="Agentic business intelligence and dataset analysis API.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    )
    app.middleware("http")(request_logging_middleware)

    add_authentication_routes(app, prefix=settings.api_v1_prefix)

    @app.exception_handler(ApplicationError)
    async def application_error_handler(_: Request, exc: ApplicationError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"sts": False, "err": exc.error, "msg": exc.message, "data": None},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(_: Request, exc: RequestValidationError):
        errors = [
            {"field": ".".join(str(part) for part in item["loc"] if part != "body"), "message": item["msg"]}
            for item in exc.errors()
        ]
        return JSONResponse(
            status_code=422,
            content={"sts": False, "err": "validation_error", "msg": "Request validation failed.", "data": errors},
        )

    @app.exception_handler(Exception)
    async def unexpected_error_handler(request: Request, exc: Exception):
        logger.exception("Unhandled error for %s %s", request.method, request.url.path, exc_info=exc)
        return JSONResponse(
            status_code=500,
            content={"sts": False, "err": "internal_error", "msg": "An unexpected error occurred.", "data": None},
        )

    @app.get("/health", response_model=HealthResponse, tags=["System"])
    def health() -> HealthResponse:
        return HealthResponse(
            sts=True,
            msg="DataMind AI API is ready.",
            data=HealthData(service=settings.app_name, version="0.1.0", environment=settings.app_env),
        )

    return app


application = configure_application()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(application, host="127.0.0.1", port=8000)
