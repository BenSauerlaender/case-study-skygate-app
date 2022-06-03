import { defineStore } from "pinia";
import { api, type RegistrationProps } from "@/helper/apiCalls";

export const useStore = defineStore({
  id: "store",
  state: () => ({
    accessToken: null as null | string,
    accessTokenAutoRefreshTimeout: null as null | number,
    user: null,
  }),
  getters: {
    loggedIn(): boolean {
      return this.accessToken !== null;
    },
    accessTokenPayload(): { id: number; exp: number } | undefined {
      if (!this.accessToken) return undefined;
      return JSON.parse(window.atob(this.accessToken.split(".")[1]));
    },
  },
  actions: {
    async registerUser(props: RegistrationProps): Promise<void> {
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

    async loginUser(email: string, password: string): Promise<void> {
      if (this.loggedIn) throw new Error("alreadyLoggedIn");
      await api.sendLogin(email, password);
      await this.fetchAccessToken();
    },

    async loginSilently(): Promise<void> {
      if (this.loggedIn) throw new Error("alreadyLoggedIn");
      await this.fetchAccessToken();
    },

    async fetchAccessToken(): Promise<void> {
      this.accessToken = await api.getToken();
      this.autoRefreshAccessToken();
    },

    autoRefreshAccessToken(): void {
      if (this.loggedIn) {
        const timeRemaining = this.accessTokenPayload!.exp * 1000 - Date.now();
        this.accessTokenAutoRefreshTimeout = setTimeout(() => {
          api
            .getToken()
            .then((token) => {
              this.accessToken = token;
              this.autoRefreshAccessToken();
            })
            .catch(() => (this.accessToken = null));
        }, timeRemaining - 30000);
      }
    },
    async logoutUser(): Promise<void> {
      if (!this.accessToken) throw new Error("UserNotLoggedIn");
      if (this.accessTokenAutoRefreshTimeout) {
        clearTimeout(this.accessTokenAutoRefreshTimeout);
      }
      await api.sendLogout(this.accessTokenPayload?.id!, this.accessToken);
      this.accessToken = null;
    },
  },
});