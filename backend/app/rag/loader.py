from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_core.documents import Document


def load_file(path: str) -> list[Document]:
    file_path = Path(path)
    suffix = file_path.suffix.lower()

    if suffix == ".pdf":
        return PyPDFLoader(str(file_path)).load()

    if suffix == ".txt":
        return TextLoader(str(file_path), encoding="utf-8").load()

    raise ValueError("Only PDF and TXT files are supported.")
