from app.rag.loader import load_file
from app.rag.splitter import split_documents
from app.services.vector_store import save_chunks


def ingest_file(path: str, source_name: str) -> int:
    documents = load_file(path)

    for document in documents:
        document.metadata["source"] = source_name

    chunks = split_documents(documents)

    return save_chunks(chunks)
