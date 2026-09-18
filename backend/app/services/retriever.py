from langchain_core.documents import Document

from app.services.vector_store import similarity_search


def retrieve_documents(query: str, k: int = 5) -> list[Document]:
    return similarity_search(query, k=k)
