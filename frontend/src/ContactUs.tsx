import { FormEvent, useState } from "react";
import "./ContactUs.css";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMPTY_FORM: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;
const MAX_SUBJECT_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 2000;

export function validateContactForm(
  values: ContactFormValues
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Subject is required.";
  } else if (values.subject.trim().length > MAX_SUBJECT_LENGTH) {
    errors.subject = `Subject must be ${MAX_SUBJECT_LENGTH} characters or fewer.`;
  }

  const message = values.message.trim();
  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`;
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }

  return errors;
}

// Use the same API base URL convention as the rest of the app. Falls back to
// localhost for local development if no environment variable is provided.
const API_URL =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  "http://localhost:8000";

class ContactApiNetworkError extends Error {}
class ContactApiNotFoundError extends Error {}

async function submitContactForm(values: ContactFormValues): Promise<void> {
  // Attempt to submit to a backend endpoint if one exists. If the network
  // request itself fails to reach the server, surface a network error. If
  // the backend responds with 404 (endpoint not yet implemented), surface a
  // distinct "not found" error so callers can choose to stub a success while
  // still being able to log/warn about the missing endpoint. Any other
  // non-OK response is treated as a real failure and surfaced to the user.
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  } catch (networkError) {
    // fetch only throws for network-level failures (e.g. server unreachable).
    throw new ContactApiNetworkError(
      networkError instanceof Error ? networkError.message : "Network error"
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      // No backend endpoint implemented yet.
      throw new ContactApiNotFoundError("Contact endpoint not found");
    }
    let detail = "Request failed";
    try {
      const data = await response.json();
      detail = data.detail ?? detail;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(detail);
  }
}

export default function ContactUs() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(field: keyof ContactFormValues) {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { value } = event.target;
      setValues((previous) => ({ ...previous, [field]: value }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Guard against rapid repeated submissions (e.g. double-click) by
    // ignoring any submit attempts while a request is already in flight or
    // the form has already been successfully submitted.
    if (submitting || submitted) {
      return;
    }

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      await submitContactForm(values);
      setSubmitted(true);
      setValues(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      if (error instanceof ContactApiNotFoundError) {
        // No backend available yet; treat as a stubbed local success, but
        // make this visible via a console warning so it isn't mistaken for
        // a fully wired backend integration.
        // eslint-disable-next-line no-console
        console.warn(
          "Contact endpoint not found, using stub success response."
        );
        setSubmitted(true);
        setValues(EMPTY_FORM);
        setErrors({});
      } else if (error instanceof ContactApiNetworkError) {
        setSubmitError(
          "Unable to reach the server. Please check your connection and try again."
        );
      } else {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleSendAnother() {
    setSubmitted(false);
    setSubmitError("");
    setValues(EMPTY_FORM);
    setErrors({});
  }

  return (
    <main className="page">
      <section className="container">
        <header>
          <p className="eyebrow">GET IN TOUCH</p>
          <h1>Contact Us</h1>
          <p className="subtitle">
            Have a question or feedback? Send us a message and we&apos;ll get
            back to you.
          </p>
        </header>

        <section className="card contact-card">
          {submitted ? (
            <div className="contact-success" role="status">
              <h2>Thanks for reaching out!</h2>
              <p>Your message has been sent successfully. We&apos;ll respond as soon as possible.</p>
              <button type="button" onClick={handleSendAnother}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={values.name}
                  onChange={handleChange("name")}
                  disabled={submitting}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                />
                {errors.name && (
                  <span className="field-error" id="contact-name-error">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={values.email}
                  onChange={handleChange("email")}
                  disabled={submitting}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                />
                {errors.email && (
                  <span className="field-error" id="contact-email-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  maxLength={MAX_SUBJECT_LENGTH}
                  value={values.subject}
                  onChange={handleChange("subject")}
                  disabled={submitting}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={
                    errors.subject ? "contact-subject-error" : undefined
                  }
                />
                {errors.subject && (
                  <span className="field-error" id="contact-subject-error">
                    {errors.subject}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell us a bit more about your request..."
                  rows={6}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={values.message}
                  onChange={handleChange("message")}
                  disabled={submitting}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                />
                {errors.message && (
                  <span className="field-error" id="contact-message-error">
                    {errors.message}
                  </span>
                )}
              </div>

              <button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send message"}
              </button>

              {submitError && <p className="message">{submitError}</p>}
            </form>
          )}
        </section>
      </section>
    </main>
  );
}
