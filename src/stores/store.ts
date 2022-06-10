import { defineStore } from "pinia";
import {
  api,
  type ContactData,
  type PrivateUser,
  type PublicUser,
  type SearchQuery,
} from "@/helper/apiCalls";
import { UserNotLoggedInError } from "@/helper/errors";

export const useStore = defineStore({
  id: "store",
  state: () => ({
    accessToken: "",
    accessTokenAutoRefreshTimeout: null as null | number,
    loggedInUser: null as PublicUser | null,
  }),
  getters: {
    loggedIn(): boolean {
      return this.accessToken !== "";
    },
    isAdmin(): boolean {
      return (
        this.accessTokenPayload?.perm.includes("user:{all}:{all}") ?? false
      );
    },
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
  },
});
