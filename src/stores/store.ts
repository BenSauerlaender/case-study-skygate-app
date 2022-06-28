import { defineStore } from "pinia";
import { api } from "@/helper/apiCalls";
import type {
  ContactData,
  PrivateUser,
  PublicUser,
  SearchQuery,
} from "@/helper/types";
import type { LocationQueryValue } from "vue-router";

export const useStore = defineStore({
  id: "store",
  state: () => ({
    //jwt to get authenticate to the api, or "" if the user is not logged in
    accessToken: "",
    //magic stuff that refreshes the accessToken
    accessTokenAutoRefreshTimeout: null as null | number,
    //all the user's data, or null if it is not logged in
    loggedInUser: null as PublicUser | null,
  }),
  getters: {
    //check if user is logged in
    loggedIn(): boolean {
      return this.accessToken !== "";
    },
    //check if user has admin permissions
    isAdmin(): boolean {
      return (
        this.accessTokenPayload?.perm.includes("user:{all}:{all}") ?? false
      );
    },
    //get the accessToken jwt-payload (userID (id), seconds until expiration (exp), users permissions (perm))
    accessTokenPayload():
      | { id: number; exp: number; perm: string }
      | undefined {
      if (this.accessToken === "") return undefined;
      //decode the jwt
      return JSON.parse(window.atob(this.accessToken.split(".")[1]));
    },
  },
  actions: {
    async registerUser(props: PrivateUser): Promise<void> {
      //filter out all other (not needed keys)
      return await api.sendRegistration(
        Object.assign(
          {},
          ...(
            ["email", "name", "postcode", "city", "phone", "password"] as const
          ).map((key) => ({ [key]: props[key] }))
        )
      );
    },

    //get refreshToken and then accessToken
    async loginUser(email: string, password: string): Promise<void> {
      if (this.loggedIn) throw new Error("alreadyLoggedIn");
      await api.sendLogin(email, password);
      await this.fetchAccessToken();
    },

    //get an accessToken without user interaction (possible if the refreshToken is still in the cookies)
    async loginSilently(): Promise<void> {
      if (this.loggedIn) throw new Error("alreadyLoggedIn");
      await this.fetchAccessToken();
    },

    //get an accessToken and start the automatic refresh
    async fetchAccessToken(): Promise<void> {
      try {
        this.accessToken = await api.getToken();
        this.autoRefreshAccessToken();
      } catch {
        this.accessToken = "";
      }
    },

    //ensures there is always a valid accessToken
    autoRefreshAccessToken(): void {
      if (this.loggedIn) {
        //time in milliseconds until the accessToken expires
        const timeRemaining = this.accessTokenPayload!.exp * 1000 - Date.now();

        //call refresh 30 seconds before expiration
        this.accessTokenAutoRefreshTimeout = setTimeout(() => {
          //get the new token and call self again.
          api
            .getToken()
            .then((token) => {
              this.accessToken = token;
              this.autoRefreshAccessToken();
            })
            .catch(() => (this.accessToken = ""));
        }, timeRemaining - 30000);
      }
    },

    async fetchUser(): Promise<void> {
      this.loggedInUser = await this.getUser(this.accessTokenPayload!.id);
    },

    //logout the user from the site and make the refreshToken invalid, so the user need email/password to login again.
    async logoutUser(): Promise<void> {
      //cancel the autoRefresh
      if (this.accessTokenAutoRefreshTimeout) {
        clearTimeout(this.accessTokenAutoRefreshTimeout);
      }
      //make refreshToken invalid
      await api.logoutUser(this.accessTokenPayload!.id, this.accessToken);

      //remove loggedIn state
      this.accessToken = "";
      this.loggedInUser = null;
    },

    async updateUsersEmail(id: number, email: string): Promise<void> {
      await api.updateUsersEmail(id, email, this.accessToken);
    },

    async updateUsersPassword(
      id: number,
      oldPassword: string,
      newPassword: string
    ): Promise<void> {
      await api.updateUsersPassword(
        id,
        oldPassword,
        newPassword,
        this.accessToken
      );
    },

    async updateUserContactData(
      id: number,
      data: Partial<ContactData>
    ): Promise<void> {
      await api.updateUsersContactData(id, data, this.accessToken);
    },

    async getUser(id: number): Promise<PublicUser> {
      return await api.getUser(id, this.accessToken);
    },

    async getSearchLength(query: SearchQuery): Promise<number> {
      return await api.getSearchLength(query, this.accessToken!);
    },
    async getSearchResults(query: SearchQuery): Promise<Array<PublicUser>> {
      return await api.getSearchResults(query, this.accessToken!);
    },

    //delete a user, if its the logged in user -> log out.
    async deleteUser(id: number): Promise<void> {
      await api.deleteUser(id, this.accessToken!);
      if (id === this.accessTokenPayload?.id) {
        if (this.accessTokenAutoRefreshTimeout) {
          clearTimeout(this.accessTokenAutoRefreshTimeout);
        }
        this.accessToken = "";
        this.loggedInUser = null;
      }
    },

    //verifies an email change request (also parses the locationQueryValues to Ints)
    async verifyEmailChange(
      id: LocationQueryValue | LocationQueryValue[],
      code: LocationQueryValue | LocationQueryValue[]
    ): Promise<void> {
      const userID = queryValueToInt(id);
      await api.verifyEmailChange(userID, queryValueToInt(code));
      //if the user whose email was changed is currently logged in -> log hin out (bc they refreshToken is now invalid anyways)
      if (this.accessTokenPayload?.id === userID) {
        console.log(userID);
        await this.logoutUser();
      }
    },

    //verifies an User (also parses the locationQueryValues to Ints)
    async verifyUser(
      id: LocationQueryValue | LocationQueryValue[],
      code: LocationQueryValue | LocationQueryValue[]
    ): Promise<void> {
      await api.verifyUser(queryValueToInt(id), queryValueToInt(code));
    },
  },
});

//converts a queryValue to an int or throw an error if that is not possible
const queryValueToInt = (
  value: LocationQueryValue | LocationQueryValue[]
): number => {
  let v = value;
  if (v instanceof Array) {
    v = v[0];
  }
  if (v) {
    let num = Number.parseInt(v);
    if (num) return num;
  }
  throw new Error("Query value is not parsable to int");
};
