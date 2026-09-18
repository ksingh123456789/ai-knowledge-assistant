from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate

from app.graph.state import GraphState
from app.services.llm import get_llm
from app.services.retriever import retrieve_documents


def retrieve(state: GraphState) -> dict:
    query = state["search_query"] or state["question"]

    documents = retrieve_documents(query, k=5)

    return {
        "context": documents,
        "attempts": state["attempts"] + 1,
    }


def grade_context(state: GraphState) -> str:
    if not state["context"]:
        return "rewrite"

    # Simple educational rule first.
    # Later we will replace this with an LLM-based relevance grader.
    total_chars = sum(len(doc.page_content) for doc in state["context"])

    if total_chars >= 150:
        return "generate"

    if state["attempts"] < 2:
        return "rewrite"

    return "generate"


def rewrite_query(state: GraphState) -> dict:
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Rewrite the user's question into a concise search query "
                "for a company knowledge base. Return only the query.",
            ),
            ("human", "{question}"),
        ]
    )

    response = llm.invoke(
        prompt.format_messages(question=state["question"])
    )

    return {"search_query": response.content.strip()}


def generate_answer(state: GraphState) -> dict:
    llm = get_llm()

    context = "\n\n".join(
        f"Source: {doc.metadata.get('source', 'unknown')}\n"
        f"Page: {doc.metadata.get('page', 'N/A')}\n"
        f"{doc.page_content}"
        for doc in state["context"]
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a company knowledge assistant. "
                "Answer using only the supplied context. "
                "If the context does not contain the answer, say "
                "you do not have enough information. "
                "Do not invent policies.",
            ),
            (
                "human",
                "Context:\n{context}\n\nQuestion:\n{question}",
            ),
        ]
    )

    response = llm.invoke(
        prompt.format_messages(
            context=context,
            question=state["question"],
        )
    )

    return {"answer": response.content}


def build_source_payload(documents: list[Document]) -> list[dict]:
    return [
        {
            "content": document.page_content,
            "source": document.metadata.get("source", "unknown"),
            "page": document.metadata.get("page"),
        }
        for document in documents
    ]
