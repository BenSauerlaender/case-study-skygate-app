import { defineStore } from "pinia";
import jwt_decode from "jwt-decode";
import {
  getToken,
  sendRegistration,
  type RegistrationErrorType,
  type RegistrationProps,
} from "@/helper/backendInterface";
import { useSSRContext } from "vue";

export const useStore = defineStore({
  id: "store",
  state: () => ({
    accessToken: null,
    user: null,
  }),
  getters: {
    loggedIn(): boolean {
      return this.accessToken !== null;
    },
  },
  actions: {
    async registerUser(props: RegistrationProps): Promise<void> {
      //filter out all other (not needed keys)
      return await sendRegistration(
        Object.assign(
          {},
          ...(
            ["email", "name", "postcode", "city", "phone", "password"] as const
          ).map((key) => ({ [key]: props[key] }))
        )
      );
    },
    async fetchAccessToken(): Promise<boolean> {
      let token = await getToken();
      if (token === false) {
        return false;
      }
      this.accessToken = jwt_decode(token);
      return true;
    },
    fetchUser() {},
  },
});
