import pytest
from app.services.auth_service import signup_user, login_user

TEST_EMAIL = "pytest_user_123@example.com"
TEST_PASSWORD = "Pytest1234"
DISPLAY_NAME = "Pytest User"


def test_signup_user():
    result, status = signup_user(TEST_EMAIL, TEST_PASSWORD, DISPLAY_NAME)
    # EMAIL_EXISTS is ok if user already exists
    assert status == 200 or "EMAIL_EXISTS" in str(result)
    assert "uid" in result or "error" in result


def test_login_user():
    result, status = login_user(TEST_EMAIL, TEST_PASSWORD)
    assert status == 200
    assert "uid" in result
    assert "idToken" in result

