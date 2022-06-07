import type { User, UserWithID } from "@/stores/store";
import axios from "axios";
import { ConnectionError, InvalidPropsError } from "./errors";

const API_URL = "http://localhost:3000/api/v1";

async function sendRegistration(props: User): Promise<void> {
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

async function getUser(userID: number, token: string): Promise<UserWithID> {
  const user: User = (
    await axios.get(API_URL + `/users/${userID}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
  ).data;
  return { ...user, id: userID };
}
async function updateUser(
  userID: number,
  data: Partial<User>,
  token: string
): Promise<void> {
  try {
    await axios.put(API_URL + `/users/${userID}`, data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
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

async function sendLogout(userID: number, token: string): Promise<void> {
  try {
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

export const api = {
  sendRegistration,
  sendLogin,
  getToken,
  sendLogout,
  getUser,
  updateUser,
};
