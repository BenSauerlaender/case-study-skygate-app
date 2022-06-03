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

async function sendRegistration(props: RegistrationProps): Promise<void> {
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

async function sendLogin(email: string, password: string): Promise<void> {
  try {
    await axios.post(
      API_URL + "/login",
      { email: email, password: password },
      { withCredentials: true }
    );
    return;
  } catch (err: any) {
    if (err.response) {
      if (err.response.status === 400) {
        const errorCode = err.response.data.errorCode;
        if (errorCode === 201) {
          throw new InvalidPropsError("noUser");
        }
        if (errorCode === 215) {
          throw new InvalidPropsError("wrongPassword");
        }
      }
    }
    throw new ConnectionError();
  }
}

async function getToken(): Promise<string> {
  return (await axios.get(API_URL + "/token")).data.accessToken as string;
}

async function sendLogout(userID: number, token: string): Promise<void> {
  await axios.post(
    API_URL + `/users/${userID}/logout`,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return;
}

export const api = { sendRegistration, sendLogin, getToken, sendLogout };
