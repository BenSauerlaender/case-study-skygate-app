import axios from "axios";
import {
  BadPasswordError,
  ApiError,
  InvalidPropsError,
  InvalidSearchError,
  NoUserError,
  UserNotLoggedInError,
  AlreadyVerifiedError,
} from "./errors";
import type {
  ContactData,
  PrivateUser,
  PublicUser,
  SearchQuery,
} from "./types";

/**
 * A collection of functions to communicate with the backend-api via axios.
 */

//The Base URL, where the backend is reachable
const API_URL = "http://localhost:3000/api/v1";

//registers a new user
async function sendRegistration(props: PrivateUser): Promise<void> {
  await axios.post(API_URL + "/register", props).catch(handleError);
}

//gets an refreshTokenCookie by sending email and password
async function sendLogin(email: string, password: string): Promise<void> {
  await axios
    .post(API_URL + "/login", { email: email, password: password })
    .catch(handleError);
}

//gets a new accessToken by sending the refreshTokenCookie
async function getToken(): Promise<string> {
  const response = await axios.get(API_URL + "/token").catch(handleError);
  return response.data.accessToken as string;
}

//gets a users data by specifying its id.
async function getUser(userID: number, token: string): Promise<PublicUser> {
  const response = await axios
    .get(API_URL + `/users/${userID}`, withAccessToken(token))
    .catch(handleError);
  return { ...response.data, id: userID };
}

//updates a users contact data
async function updateUsersContactData(
  userID: number,
  data: Partial<ContactData>,
  token: string
): Promise<void> {
  await axios
    .put(API_URL + `/users/${userID}`, data, withAccessToken(token))
    .catch(handleError);
}

//updates a users email address
async function updateUsersEmail(
  userID: number,
  email: string,
  token: string
): Promise<void> {
  await axios
    .post(
      API_URL + `/users/${userID}/email-change`,
      { email: email },
      withAccessToken(token)
    )
    .catch(handleError);
}

//updates a users role
async function updateUsersRole(
  userID: number,
  role: string,
  token: string
): Promise<void> {
  await axios
    .put(
      API_URL + `/users/${userID}/role`,
      { role: role },
      withAccessToken(token)
    )
    .catch(handleError);
}

//updates a users email address without need to verify it
async function updateUsersEmailPrivileged(
  userID: number,
  email: string,
  token: string
): Promise<void> {
  await axios
    .post(
      API_URL + `/users/${userID}/email-change-privileged`,
      { email: email },
      withAccessToken(token)
    )
    .catch(handleError);
}

//updates a users password
async function updateUsersPassword(
  userID: number,
  oldPassword: string,
  newPassword: string,
  token: string
): Promise<void> {
  await axios
    .put(
      API_URL + `/users/${userID}/password`,
      { oldPassword: oldPassword, newPassword: newPassword },
      withAccessToken(token)
    )
    .catch(handleError);
}

//updates a users password without need for the old
async function updateUsersPasswordPrivileged(
  userID: number,
  newPassword: string,
  token: string
): Promise<void> {
  await axios
    .put(
      API_URL + `/users/${userID}/password-privileged-change`,
      { newPassword: newPassword },
      withAccessToken(token)
    )
    .catch(handleError);
}

//permanently deletes a user
async function deleteUser(userID: number, token: string): Promise<void> {
  await axios
    .delete(API_URL + `/users/${userID}`, withAccessToken(token))
    .catch(handleError);
}

//makes the current refreshTokenCookie invalid
async function logoutUser(userID: number, token: string): Promise<void> {
  await axios
    .post(API_URL + `/users/${userID}/logout`, {}, withAccessToken(token))
    .catch(handleError);
}

//gets all users found by the specified query
async function getSearchResults(
  query: SearchQuery,
  token: string
): Promise<Array<PublicUser>> {
  //need to change null to '' because axios cant send null.
  const fixedQuery: any = { ...query };
  if (query.DESC === null) {
    fixedQuery.DESC = "";
  }

  const response = await axios
    .get(API_URL + `/users`, {
      params: fixedQuery,
      ...withAccessToken(token),
    })
    .catch(handleError);

  return response.data;
}

//gets only the number of users that would be returned by getSearchResults with the same query
async function getSearchLength(
  query: SearchQuery,
  token: string
): Promise<number> {
  const response = await axios
    .get(API_URL + `/users/length`, {
      params: query,
      ...withAccessToken(token),
    })
    .catch(handleError);
  return response.data.length;
}

//verifies an emailChange request
async function verifyEmailChange(userID: number, code: number): Promise<void> {
  await axios
    .post(API_URL + `/users/${userID}/email-change-verify`, { code: code })
    .catch(handleError);
}

//verifies an User
async function verifyUser(userID: number, code: number): Promise<void> {
  await axios
    .post(API_URL + `/users/${userID}/verify`, { code: code })
    .catch(handleError);
}

//Get all available roles
async function getRoles(token: string): Promise<string[]> {
  const response = await axios
    .get(API_URL + `/role`, withAccessToken(token))
    .catch(handleError);
  return response.data;
}

//wraps the accessToken in an axios config object
const withAccessToken = (token: string) => {
  if (token === "") throw new UserNotLoggedInError();
  return {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
};

const handleError = (error: any) => {
  if (error.response) {
    if (error.response.status === 400) {
      const data = error.response.data;
      if (data.errorCode === 102) {
        throw new InvalidPropsError("", data.invalidProperties);
      } else if (data.errorCode === 111) {
        throw new InvalidSearchError();
      } else if (data.errorCode === 201) {
        throw new NoUserError();
      } else if (data.errorCode === 210 || data.errorCode === 212) {
        throw new AlreadyVerifiedError();
      } else if (data.errorCode === 215) {
        throw new BadPasswordError();
      }
    } else if (error.response.status === 401) {
      throw new UserNotLoggedInError();
    }
  }
  throw new ApiError();
};

export const api = {
  sendRegistration,
  sendLogin,
  getToken,
  logoutUser,
  getUser,
  updateUsersContactData,
  updateUsersRole,
  updateUsersEmail,
  updateUsersEmailPrivileged,
  updateUsersPassword,
  updateUsersPasswordPrivileged,
  getSearchLength,
  getSearchResults,
  deleteUser,
  verifyEmailChange,
  verifyUser,
  getRoles,
};
