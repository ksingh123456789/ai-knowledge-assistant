import { ChangeEvent, useState } from "react";

const API_URL = "http://localhost:8000";

type Source = {
  content: string;
  source: string;
  page?: number | null;
};

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("openrouter/free");
  const [apiKey, setApiKey] = useState("");

  async function askQuestion() {
    if (!question.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          model: selectedModel,
          api_key: apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "Request failed");
      }

      setAnswer(data.answer);
      setSources(data.sources ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function uploadDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/documents/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "Upload failed");
      }

      setMessage(
        `${data.filename} uploaded. ${data.chunks_created} chunks created.`
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="page">
      <section className="container">
        <header>
          <p className="eyebrow">RAG • LANGGRAPH • PGVECTOR</p>
          <h1>AI Knowledge Assistant</h1>
          <p className="subtitle">
            Upload your company documents and ask questions about them.
          </p>
        </header>

        <section className="card">
          <h2>1. Upload document</h2>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={uploadDocument}
            disabled={uploading}
          />
          {uploading && <p>Uploading and creating embeddings...</p>}
        </section>

        <section className="card">
          <h2>2. Ask a question</h2>

          <label htmlFor="model-select">Model</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(event) => setSelectedModel(event.target.value)}
          >
            <option value="openrouter/free">openrouter/free</option>
            <option value="google/gemma-4-26b-a4b-it:free">
              Gemma 4 26B (Free)
            </option>
          </select>

          <label htmlFor="api-key-input">API Key (optional)</label>
          <input
            id="api-key-input"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Optional API key"
          />

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Example: What is the refund policy for annual plans?"
            rows={5}
          />

          <button onClick={askQuestion} disabled={loading || !question.trim()}>
            {loading ? "Thinking..." : "Ask"}
          </button>

          {message && <p className="message">{message}</p>}
        </section>

        {answer && (
          <section className="card">
            <h2>Answer</h2>
            <p className="answer">{answer}</p>

            <h3>Sources</h3>
            {sources.map((source, index) => (
              <article className="source" key={`${source.source}-${index}`}>
                <strong>{source.source}</strong>
                {source.page != null && <span> • page {source.page}</span>}
                <p>{source.content}</p>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
