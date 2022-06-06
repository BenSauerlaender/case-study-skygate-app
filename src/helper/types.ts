export type ApiResponseStatus = "pending" | "successful" | "error" | undefined;

export type FormInputs = Partial<{
  email: string;
  name: string;
  postcode: string;
  city: string;
  phone: string;
  password: string;
  passwordRepeat: string;
  readLegals: boolean;
}>;
