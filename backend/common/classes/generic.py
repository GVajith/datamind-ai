from typing import Any

from pydantic import BaseModel, Field


class ApiResponse(BaseModel):
    sts: bool = False
    err: str = ""
    msg: str = ""
    data: Any | None = None


class HealthData(BaseModel):
    service: str
    version: str
    environment: str


class HealthResponse(ApiResponse):
    data: HealthData = Field(...)
