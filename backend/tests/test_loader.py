import os
import tempfile

import pytest

from app.rag.loader import load_file


def _write_temp_file(content: bytes, suffix: str) -> str:
    fd, path = tempfile.mkstemp(suffix=suffix)
    with os.fdopen(fd, "wb") as handle:
        handle.write(content)
    return path


def test_load_txt_file():
    path = _write_temp_file(b"Refund policy: 30 days for annual plans.", ".txt")
    try:
        documents = load_file(path)
        assert len(documents) == 1
        assert "Refund policy" in documents[0].page_content
    finally:
        os.unlink(path)


def test_load_pdf_file_with_page_metadata():
    pdf_path = os.path.join(
        os.path.dirname(__file__), "..", "sample_data", "refund_policy.pdf"
    )
    documents = load_file(pdf_path)
    assert len(documents) > 0
    assert "page" in documents[0].metadata


def test_load_docx_file_returns_documents_with_source_metadata():
    try:
        from docx import Document as DocxDocument
    except ImportError:
        pytest.skip("python-docx not installed")

    fd, path = tempfile.mkstemp(suffix=".docx")
    os.close(fd)
    try:
        docx_document = DocxDocument()
        docx_document.add_paragraph("Annual plans are refundable within 30 days.")
        docx_document.save(path)

        documents = load_file(path)
        assert len(documents) > 0
        assert "30 days" in documents[0].page_content
        assert "source" in documents[0].metadata
    finally:
        os.unlink(path)


def test_load_file_rejects_legacy_doc():
    path = _write_temp_file(b"not a real doc file", ".doc")
    try:
        with pytest.raises(ValueError, match="\\.doc"):
            load_file(path)
    finally:
        os.unlink(path)


def test_load_file_rejects_unsupported_extension():
    path = _write_temp_file(b"col1,col2\n1,2\n", ".csv")
    try:
        with pytest.raises(ValueError, match="Unsupported"):
            load_file(path)
    finally:
        os.unlink(path)


def test_load_file_rejects_empty_docx():
    fd, path = tempfile.mkstemp(suffix=".docx")
    os.close(fd)
    try:
        with pytest.raises(ValueError):
            load_file(path)
    finally:
        os.unlink(path)


def test_load_file_rejects_empty_pdf():
    fd, path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    try:
        with pytest.raises(ValueError):
            load_file(path)
    finally:
        os.unlink(path)


def test_load_file_rejects_empty_txt():
    fd, path = tempfile.mkstemp(suffix=".txt")
    os.close(fd)
    try:
        with pytest.raises(ValueError):
            load_file(path)
    finally:
        os.unlink(path)


def test_load_file_handles_uppercase_extension():
    path = _write_temp_file(b"Some content here.", ".TXT")
    try:
        documents = load_file(path)
        assert len(documents) == 1
    finally:
        os.unlink(path)


def test_load_file_handles_multiple_dots_in_filename():
    fd, path = tempfile.mkstemp(suffix=".policy.txt")
    with os.fdopen(fd, "wb") as handle:
        handle.write(b"Some content here.")
    try:
        documents = load_file(path)
        assert len(documents) == 1
    finally:
        os.unlink(path)
