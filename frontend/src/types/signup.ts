export interface SignupFormData {
  email: string;
  password: string;
  phoneNumber: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface SignupFormState {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type SignupFormErrors = Partial<Record<keyof SignupFormState, string>>;
