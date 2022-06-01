import axios from "axios";
import { ref, type Ref } from "vue";

const API_URL = "http://localhost:3000/api/v1";

export type RegistrationInput = {
  email: string;
  name: string;
  postcode: string;
  city: string;
  phone: string;
  password: string;
};

export type RegistrationErrorType =
  | "noResponse"
  | { [index: string]: Array<string> }
  | null;

export function register(
  input: RegistrationInput,
  callback: (success: boolean, error: RegistrationErrorType) => void
): void {
  let success: boolean = false;
  let error: RegistrationErrorType = null;
  axios
    .post(API_URL + "/register", input)
    .then(function (response) {
      success = true;
    })
    .catch(function (error) {
      success = false;
      if (error.response) {
        if (error.response.status === 400) {
          const data = error.response.data;
          if (data.errorCode === 102) {
            error = data.invalidProperties;
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
