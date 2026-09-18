from langgraph.graph import END, START, StateGraph

from app.graph.nodes import (
    generate_answer,
    grade_context,
    retrieve,
    rewrite_query,
)
from app.graph.state import GraphState


def build_graph():
    builder = StateGraph(GraphState)

    builder.add_node("retrieve", retrieve)
    builder.add_node("rewrite", rewrite_query)
    builder.add_node("generate", generate_answer)

    builder.add_edge(START, "retrieve")

    builder.add_conditional_edges(
        "retrieve",
        grade_context,
        {
            "generate": "generate",
            "rewrite": "rewrite",
        },
    )

    builder.add_edge("rewrite", "retrieve")
    builder.add_edge("generate", END)

    return builder.compile()


graph = build_graph()
