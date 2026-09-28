import io
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


@patch("app.api.documents.ingest_file")
def test_upload_txt_file_succeeds(mock_ingest_file):
    mock_ingest_file.return_value = 3

    response = client.post(
        "/api/documents/upload",
        files={"file": ("policy.txt", io.BytesIO(b"some content"), "text/plain")},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "policy.txt"
    assert body["chunks_created"] == 3


@patch("app.api.documents.ingest_file")
def test_upload_pdf_file_succeeds(mock_ingest_file):
    mock_ingest_file.return_value = 5

    response = client.post(
        "/api/documents/upload",
        files={"file": ("policy.pdf", io.BytesIO(b"%PDF-1.4 fake"), "application/pdf")},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "policy.pdf"
    assert body["chunks_created"] == 5


@patch("app.api.documents.ingest_file")
def test_upload_docx_file_succeeds(mock_ingest_file):
    mock_ingest_file.return_value = 2

    response = client.post(
        "/api/documents/upload",
        files={
            "file": (
                "policy.docx",
                io.BytesIO(b"fake docx bytes"),
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "policy.docx"
    assert body["chunks_created"] == 2


def test_upload_rejects_unsupported_extension():
    response = client.post(
        "/api/documents/upload",
        files={"file": ("image.png", io.BytesIO(b"fake png bytes"), "image/png")},
    )

    assert response.status_code == 400
    assert "Unsupported" in response.json()["detail"]


def test_upload_rejects_legacy_doc():
    response = client.post(
        "/api/documents/upload",
        files={"file": ("policy.doc", io.BytesIO(b"fake doc bytes"), "application/msword")},
    )

    assert response.status_code == 400
    assert ".doc" in response.json()["detail"]
    assert ".docx" in response.json()["detail"]


@patch("app.api.documents.ingest_file")
def test_upload_returns_400_when_ingestion_raises_value_error(mock_ingest_file):
    mock_ingest_file.side_effect = ValueError(
        "No content could be extracted from DOCX file 'empty.docx'."
    )

    response = client.post(
        "/api/documents/upload",
        files={
            "file": (
                "empty.docx",
                io.BytesIO(b""),
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        },
    )

    assert response.status_code == 400
    assert "empty.docx" in response.json()["detail"]
