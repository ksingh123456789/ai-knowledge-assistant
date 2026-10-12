import { ChangeEvent, FormEvent, useState } from "react";
import "./Login.css";
import {
  LoginFormErrors,
  LoginFormState,
  LoginSubmitPayload,
} from "./types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

// TODO: Replace this stub with a real API call once a backend auth
// endpoint is available (e.g., POST /api/auth/login). No real backend
// auth route exists in this repo snapshot, so we intentionally avoid
// calling a non-existent API here.
function submitLogin(payload: LoginSubmitPayload): void {
  // Note: we intentionally avoid logging the raw password value.
  console.log("Login submitted", {
    email: payload.email,
    remember: payload.remember,
  });
}

const initialFormState: LoginFormState = {
  email: "",
  password: "",
  remember: false,
};

export default function Login() {
  const [formState, setFormState] = useState<LoginFormState>(initialFormState);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setFormState((prev) => ({ ...prev, email: value }));
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setFormState((prev) => ({ ...prev, password: value }));
  }

  function handleRememberChange(event: ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    setFormState((prev) => ({ ...prev, remember: checked }));
  }

  function validate(email: string, password: string): LoginFormErrors {
    const nextErrors: LoginFormErrors = {};
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!trimmedPassword) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = formState.email.trim();
    const trimmedPassword = formState.password.trim();

    const nextErrors = validate(formState.email, formState.password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload: LoginSubmitPayload = {
      email: trimmedEmail,
      password: trimmedPassword,
      remember: formState.remember,
    };

    submitLogin(payload);
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleEmailChange}
              className={errors.email ? "invalid" : ""}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <span className="login-error" id="email-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formState.password}
              onChange={handlePasswordChange}
              className={errors.password ? "invalid" : ""}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="login-error" id="password-error">
                {errors.password}
              </span>
            )}
          </div>

          <div className="login-remember">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formState.remember}
              onChange={handleRememberChange}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="login-submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
