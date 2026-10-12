import { ChangeEvent, FormEvent, useState } from "react";
import { requestPasswordReset } from "./api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResetPasswordProps = {
  onBack?: () => void;
};

export default function ResetPassword({ onBack }: ResetPasswordProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function validateEmail(value: string): string {
    if (!value.trim()) {
      return "Email is required.";
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      return "Please enter a valid email address.";
    }
    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setError("");
    setSuccessMessage("");

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      await requestPasswordReset(email.trim());
      setSuccessMessage(
        "If this email exists, a reset link has been sent."
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <section className="container">
        <header>
          <p className="eyebrow">ACCOUNT</p>
          <h1>Reset Password</h1>
          <p className="subtitle">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </header>

        <section className="card">
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              disabled={submitting}
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {error && <p className="message error">{error}</p>}
          {successMessage && <p className="message success">{successMessage}</p>}

          {onBack && (
            <p>
              <button type="button" className="link-button" onClick={onBack}>
                Back to home
              </button>
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
