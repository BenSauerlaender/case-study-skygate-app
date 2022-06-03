import { useStore } from "@/stores/store";
import axios from "axios";
import { ConnectionError, InvalidPropsError } from "./errors";

const API_URL = "http://localhost:3000/api/v1";

export type RegistrationProps = {
  email: string;
  name: string;
  postcode: string;
  city: string;
  phone: string;
  password: string;
};

export async function sendRegistration(
  props: RegistrationProps
): Promise<void> {
  try {
    await axios.post(API_URL + "/register", props);
    return;
  } catch (err: any) {
    if (err.response) {
      if (err.response.status === 400) {
        const data = err.response.data;
        if (data.errorCode === 102) {
          throw new InvalidPropsError("", data.invalidProperties);
        }
      }
    }
    throw new ConnectionError();
  }
}

export type LoginErrorType = "" | "noUser" | "wrongPassword" | "noResponse";
export function sendLogin(
  email: string,
  password: string,
  callback: (success: boolean, error: LoginErrorType) => void
): void {
  let success: boolean = false;
  let error: LoginErrorType = "";

  axios
    .post(
      API_URL + "/login",
      { email: email, password: password },
      { withCredentials: true }
    )
    .then(function (response) {
      success = true;
      const store = useStore();
      store.fetchAccessToken();
    })
    .catch(function (err) {
      success = false;
      if (err.response) {
        if (err.response.status === 400) {
          const errorCode = err.response.data.errorCode;
          if (errorCode === 201) {
            error = "noUser";
            return;
          }
          if (errorCode === 215) {
            error = "wrongPassword";
            return;
          }
        }
      }
      error = "noResponse";
    })
    .then(() => {
      callback(success, error);
    });
}

export async function getToken(): Promise<false | string> {
  try {
    const response = await axios.get(API_URL + "/token");
    return response.data.accessToken as string;
  } catch {
    return false;
  }
}
