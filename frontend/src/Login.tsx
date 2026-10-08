import { FormEvent, useState } from "react";
import "./Login.css";

type LoginErrors = {
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(currentEmail: string, currentPassword: string): LoginErrors {
    const nextErrors: LoginErrors = {};
    const trimmedEmail = currentEmail.trim();
    const trimmedPassword = currentPassword.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!trimmedPassword) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);

    const validationErrors = validate(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // No backend auth endpoint is specified for this project yet.
      // Stub the submit behavior until an auth API is introduced.
      console.log("Login submitted", { email });
      setSubmitted(true);
    }
  }

  return (
    <section className="login-card">
      <h2>Login</h2>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="login-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
          />
          {errors.email && (
            <p className="login-error" id="login-email-error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="login-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-password-error" : undefined}
          />
          {errors.password && (
            <p className="login-error" id="login-password-error" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <button type="submit">Log in</button>

        {submitted && (
          <p className="login-success" role="status">
            Login submitted successfully.
          </p>
        )}
      </form>
    </section>
  );
}
