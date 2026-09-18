from langchain_postgres import PGVector

from app.core.config import settings
from app.services.embeddings import get_embeddings


def get_vector_store() -> PGVector:
    return PGVector(
        embeddings=get_embeddings(),
        collection_name="document_chunks",
        connection=settings.database_url,
        use_jsonb=True,
    )


def similarity_search(query: str, k: int = 5):
    return get_vector_store().similarity_search(query, k=k)


def save_chunks(chunks):
    store = get_vector_store()

    texts = [chunk.page_content for chunk in chunks]
    metadatas = [chunk.metadata for chunk in chunks]

    ids = store.add_texts(
        texts=texts,
        metadatas=metadatas,
    )

    return len(ids)
