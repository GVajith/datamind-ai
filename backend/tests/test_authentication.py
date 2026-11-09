def test_register_and_fetch_current_user(client, registered_user):
    token = registered_user["access_token"]
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json()["data"]["email"] == "ada@example.com"
    assert response.json()["data"]["role"] == "user"


def test_duplicate_registration_is_rejected(client, registered_user):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Another Ada",
            "email": "ADA@example.com",
            "password": "Analytical1!",
            "confirm_password": "Analytical1!",
        },
    )

    assert response.status_code == 409
    assert response.json()["err"] == "email_exists"


def test_login_and_logout_revoke_session(client, registered_user):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": "Analytical1!"},
    )
    assert login.status_code == 200
    token = login.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    assert client.post("/api/v1/auth/logout", headers=headers).status_code == 200
    revoked = client.get("/api/v1/auth/me", headers=headers)
    assert revoked.status_code == 401
    assert revoked.json()["err"] == "invalid_session"


def test_invalid_password_does_not_authenticate(client, registered_user):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": "Incorrect1!"},
    )

    assert response.status_code == 401
    assert response.json()["err"] == "invalid_credentials"


def test_password_reset_revokes_old_tokens(client, registered_user):
    old_token = registered_user["access_token"]
    forgot = client.post("/api/v1/auth/forgot-password", json={"email": "ada@example.com"})
    reset_token = forgot.json()["data"]["reset_token"]
    reset = client.post(
        "/api/v1/auth/reset-password",
        json={
            "token": reset_token,
            "password": "NewAnalytical2!",
            "confirm_password": "NewAnalytical2!",
        },
    )

    assert reset.status_code == 200
    assert client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {old_token}"},
    ).status_code == 401
    assert client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": "NewAnalytical2!"},
    ).status_code == 200


def test_protected_endpoint_requires_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["err"] == "authentication_required"
