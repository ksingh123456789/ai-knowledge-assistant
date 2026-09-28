from pathlib import Path

from langchain_community.document_loaders import (
    Docx2txtLoader,
    PyPDFLoader,
    TextLoader,
)
from langchain_core.documents import Document

SUPPORTED_EXTENSIONS = {".txt", ".pdf", ".docx"}


def load_file(path: str) -> list[Document]:
    file_path = Path(path)
    suffix = file_path.suffix.lower()

    if suffix == ".doc":
        raise ValueError(
            "Legacy .doc files are not supported. Please convert the file to "
            ".docx and upload again."
        )

    if suffix == ".pdf":
        try:
            documents = PyPDFLoader(str(file_path)).load()
        except Exception as error:
            raise ValueError(
                f"Failed to load PDF file '{file_path.name}': {error}"
            ) from error

        if not documents:
            raise ValueError(
                f"No content could be extracted from PDF file '{file_path.name}'. "
                "The file may be empty, corrupted, or a scanned/image-only PDF "
                "(OCR is not supported)."
            )

        return documents

    if suffix == ".txt":
        try:
            documents = TextLoader(str(file_path), encoding="utf-8").load()
        except Exception as error:
            raise ValueError(
                f"Failed to load TXT file '{file_path.name}': {error}"
            ) from error

        return documents

    if suffix == ".docx":
        try:
            documents = Docx2txtLoader(str(file_path)).load()
        except Exception as error:
            raise ValueError(
                f"Failed to load DOCX file '{file_path.name}': {error}"
            ) from error

        if not documents or not any(
            document.page_content.strip() for document in documents
        ):
            raise ValueError(
                f"No content could be extracted from DOCX file '{file_path.name}'. "
                "The file may be empty or corrupted."
            )

        for document in documents:
            document.metadata.setdefault("source", file_path.name)

        return documents

    raise ValueError(
        f"Unsupported file extension '{suffix or '(none)'}'. "
        "Only .txt, .pdf, and .docx files are supported."
    )
