import { ChangeEvent, FormEvent, useState } from "react";
import "./Signup.css";
import {
  SignupFormData,
  SignupFormErrors,
  SignupFormState,
} from "./types/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s-]+$/;
const MIN_PASSWORD_LENGTH = 8;

const INITIAL_STATE: SignupFormState = {
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

type SignupProps = {
  onSubmit?: (data: SignupFormData) => void;
};

export default function Signup({ onSubmit }: SignupProps) {
  const [formState, setFormState] = useState<SignupFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(field: keyof SignupFormState) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };
  }

  function validate(state: SignupFormState): SignupFormErrors {
    const newErrors: SignupFormErrors = {};

    const email = state.email.trim();
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!state.password) {
      newErrors.password = "Password is required.";
    } else if (state.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (!state.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (state.confirmPassword !== state.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const phoneNumber = state.phoneNumber.trim();
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!PHONE_REGEX.test(phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number may only contain digits, spaces, dashes, and an optional leading +.";
    }

    const addressLine1 = state.addressLine1.trim();
    if (!addressLine1) {
      newErrors.addressLine1 = "Address line 1 is required.";
    }

    const city = state.city.trim();
    if (!city) {
      newErrors.city = "City is required.";
    }

    const stateValue = state.state.trim();
    if (!stateValue) {
      newErrors.state = "State/Province is required.";
    }

    const postalCode = state.postalCode.trim();
    if (!postalCode) {
      newErrors.postalCode = "Postal/Zip code is required.";
    } else if (postalCode.length < 3) {
      newErrors.postalCode = "Postal/Zip code looks too short.";
    }

    const country = state.country.trim();
    if (!country) {
      newErrors.country = "Country is required.";
    }

    return newErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");

    const validationErrors = validate(formState);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const data: SignupFormData = {
      email: formState.email.trim(),
      password: formState.password,
      phoneNumber: formState.phoneNumber.trim(),
      address: {
        line1: formState.addressLine1.trim(),
        line2: formState.addressLine2.trim() || undefined,
        city: formState.city.trim(),
        state: formState.state.trim(),
        postalCode: formState.postalCode.trim(),
        country: formState.country.trim(),
      },
    };

    if (onSubmit) {
      onSubmit(data);
    } else {
      // Placeholder local handler. No backend signup endpoint was found/confirmed,
      // so this is a mock submission for review.
      // eslint-disable-next-line no-console
      console.log("Signup form submitted:", data);
    }

    setSuccessMessage("Signup successful!");
  }

  return (
    <main className="signup-page">
      <section className="signup-container">
        <header>
          <h1>Create your account</h1>
          <p className="signup-subtitle">
            Fill in the details below to sign up.
          </p>
        </header>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formState.email}
              onChange={handleChange("email")}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formState.password}
              onChange={handleChange("password")}
            />
            {errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formState.confirmPassword}
              onChange={handleChange("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              value={formState.phoneNumber}
              onChange={handleChange("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="field-error">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="addressLine1">Address Line 1</label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              required
              value={formState.addressLine1}
              onChange={handleChange("addressLine1")}
            />
            {errors.addressLine1 && (
              <p className="field-error">{errors.addressLine1}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="addressLine2">Address Line 2 (optional)</label>
            <input
              id="addressLine2"
              name="addressLine2"
              type="text"
              value={formState.addressLine2}
              onChange={handleChange("addressLine2")}
            />
          </div>

          <div className="form-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={formState.city}
              onChange={handleChange("city")}
            />
            {errors.city && <p className="field-error">{errors.city}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="state">State/Province</label>
            <input
              id="state"
              name="state"
              type="text"
              required
              value={formState.state}
              onChange={handleChange("state")}
            />
            {errors.state && <p className="field-error">{errors.state}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="postalCode">Postal/Zip Code</label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              required
              value={formState.postalCode}
              onChange={handleChange("postalCode")}
            />
            {errors.postalCode && (
              <p className="field-error">{errors.postalCode}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              name="country"
              type="text"
              required
              value={formState.country}
              onChange={handleChange("country")}
            />
            {errors.country && (
              <p className="field-error">{errors.country}</p>
            )}
          </div>

          <button type="submit" className="signup-submit">
            Sign Up
          </button>

          {successMessage && (
            <p className="signup-success">{successMessage}</p>
          )}
        </form>
      </section>
    </main>
  );
}
