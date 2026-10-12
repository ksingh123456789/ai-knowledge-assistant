export type LoginFormState = {
  email: string;
  password: string;
  remember: boolean;
};

export type LoginSubmitPayload = {
  email: string;
  password: string;
  remember: boolean;
};

export type LoginFormErrors = {
  email?: string;
  password?: string;
};
