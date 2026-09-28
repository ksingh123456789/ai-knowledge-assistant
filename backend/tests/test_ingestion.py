import os
import tempfile
from unittest.mock import patch

import pytest

from app.rag.ingestion import ingest_file


@patch("app.rag.ingestion.save_chunks")
def test_ingest_txt_file_produces_chunks_with_source(mock_save_chunks):
    mock_save_chunks.side_effect = lambda chunks: len(chunks)

    fd, path = tempfile.mkstemp(suffix=".txt")
    with os.fdopen(fd, "wb") as handle:
        handle.write(b"Refund policy: annual plans are refundable within 30 days. " * 5)
    try:
        chunk_count = ingest_file(path=path, source_name="refund_policy.txt")
        assert chunk_count > 0

        saved_chunks = mock_save_chunks.call_args[0][0]
        assert all(chunk.metadata["source"] == "refund_policy.txt" for chunk in saved_chunks)
    finally:
        os.unlink(path)


@patch("app.rag.ingestion.save_chunks")
def test_ingest_pdf_file_preserves_page_metadata(mock_save_chunks):
    mock_save_chunks.side_effect = lambda chunks: len(chunks)

    pdf_path = os.path.join(
        os.path.dirname(__file__), "..", "sample_data", "refund_policy.pdf"
    )
    chunk_count = ingest_file(path=pdf_path, source_name="refund_policy.pdf")
    assert chunk_count > 0

    saved_chunks = mock_save_chunks.call_args[0][0]
    assert all("page" in chunk.metadata for chunk in saved_chunks)
    assert all(chunk.metadata["source"] == "refund_policy.pdf" for chunk in saved_chunks)


@patch("app.rag.ingestion.save_chunks")
def test_ingest_docx_file_produces_non_empty_chunks(mock_save_chunks):
    try:
        from docx import Document as DocxDocument
    except ImportError:
        pytest.skip("python-docx not installed")

    mock_save_chunks.side_effect = lambda chunks: len(chunks)

    fd, path = tempfile.mkstemp(suffix=".docx")
    os.close(fd)
    try:
        docx_document = DocxDocument()
        docx_document.add_paragraph(
            "Refund policy: annual plans are refundable within 30 days. " * 5
        )
        docx_document.save(path)

        chunk_count = ingest_file(path=path, source_name="refund_policy.docx")
        assert chunk_count > 0

        saved_chunks = mock_save_chunks.call_args[0][0]
        assert all(chunk.metadata["source"] == "refund_policy.docx" for chunk in saved_chunks)
        assert all(chunk.page_content.strip() for chunk in saved_chunks)
    finally:
        os.unlink(path)


def test_ingest_file_raises_for_unsupported_extension():
    fd, path = tempfile.mkstemp(suffix=".png")
    os.close(fd)
    try:
        with pytest.raises(ValueError):
            ingest_file(path=path, source_name="image.png")
    finally:
        os.unlink(path)


def test_ingest_file_raises_for_empty_docx():
    fd, path = tempfile.mkstemp(suffix=".docx")
    os.close(fd)
    try:
        with pytest.raises(ValueError):
            ingest_file(path=path, source_name="empty.docx")
    finally:
        os.unlink(path)


def test_ingest_file_raises_for_empty_txt():
    fd, path = tempfile.mkstemp(suffix=".txt")
    os.close(fd)
    try:
        with pytest.raises(ValueError):
            ingest_file(path=path, source_name="empty.txt")
    finally:
        os.unlink(path)
