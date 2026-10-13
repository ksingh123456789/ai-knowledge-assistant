export default function AboutUs() {
  return (
    <main className="page">
      <section className="container">
        <header>
          <p className="eyebrow">ABOUT US</p>
          <h1>About This Product</h1>
          <p className="subtitle">
            Learn more about our platform and the AI Knowledge Assistant
            feature that powers it.
          </p>
        </header>

        <section className="card">
          <h2>Who We Are</h2>
          <p>
            We build tools that help teams get instant, trustworthy answers
            from their own documents. Our platform combines document
            management, retrieval-augmented generation (RAG), and
            integrations with tools like Jira to streamline how teams find
            information and manage work.
          </p>
        </section>

        <section className="card">
          <h2>AI Knowledge Assistant</h2>
          <p>
            The AI Knowledge Assistant is the core feature of our platform.
            It lets you upload your company documents — such as PDFs and
            text files — and ask natural-language questions about their
            contents, getting accurate, source-backed answers in seconds.
          </p>

          <h3>What It Is</h3>
          <p>
            The AI Knowledge Assistant is a retrieval-augmented question
            answering system. Instead of relying solely on a general-purpose
            language model, it searches your uploaded knowledge base for the
            most relevant content before generating an answer, ensuring
            responses are grounded in your own data.
          </p>

          <h3>How It Works</h3>
          <ul>
            <li>
              You upload documents (PDF, TXT) which are split into chunks
              and converted into vector embeddings.
            </li>
            <li>
              These embeddings are stored in a vector database, enabling fast
              semantic search.
            </li>
            <li>
              When you ask a question, the assistant retrieves the most
              relevant document chunks and uses them as context for
              generating a precise answer.
            </li>
            <li>
              Every answer includes references to the original source
              documents and page numbers, so you can verify the information.
            </li>
          </ul>

          <h3>Key Benefits</h3>
          <ul>
            <li>
              <strong>Accuracy:</strong> Answers are grounded in your actual
              documents, reducing the risk of hallucinated or irrelevant
              responses.
            </li>
            <li>
              <strong>Speed:</strong> Instantly search across large volumes
              of documents without manually reading through them.
            </li>
            <li>
              <strong>Transparency:</strong> Source citations let you trace
              every answer back to its origin.
            </li>
            <li>
              <strong>Productivity:</strong> Teams spend less time searching
              for information and more time acting on it.
            </li>
          </ul>
        </section>

        <section className="card">
          <h2>Our Mission</h2>
          <p>
            Our mission is to make organizational knowledge instantly
            accessible, so teams can make faster, better-informed decisions
            without digging through scattered documents.
          </p>
        </section>
      </section>
    </main>
  );
}
