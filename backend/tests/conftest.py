import os

os.environ["APP_ENV"] = "test"
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-with-more-than-thirty-two-characters"

import pytest
from fastapi.testclient import TestClient

from database.connection import build_engine, get_connection
from database.tables import metadata
from main import application


@pytest.fixture()
def database_engine():
    test_engine = build_engine("sqlite://")
    metadata.create_all(test_engine)
    yield test_engine
    metadata.drop_all(test_engine)
    test_engine.dispose()


@pytest.fixture()
def client(database_engine):
    def test_connection():
        with database_engine.begin() as connection:
            yield connection

    application.dependency_overrides[get_connection] = test_connection
    with TestClient(application) as test_client:
        yield test_client
    application.dependency_overrides.clear()


@pytest.fixture()
def registered_user(client):
    payload = {
        "full_name": "Ada Lovelace",
        "email": "ada@example.com",
        "password": "Analytical1!",
        "confirm_password": "Analytical1!",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    return response.json()["data"]
