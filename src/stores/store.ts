import { defineStore } from "pinia";
import { api } from "@/helper/apiCalls";

export const useStore = defineStore({
  id: "store",
  state: () => ({
    accessToken: undefined as null | undefined | string,
    accessTokenAutoRefreshTimeout: null as null | number,
    user: null as UserWithID | null,
    roles: [] as string[],
  }),
  getters: {
    loggedIn(): boolean | undefined {
      if (this.accessToken === undefined) return undefined;
      return this.accessToken !== null;
    },
    accessTokenPayload(): { id: number; exp: number } | undefined {
      if (!this.accessToken) return undefined;
      return JSON.parse(window.atob(this.accessToken.split(".")[1]));
    },
  },
  actions: {
    async registerUser(props: User): Promise<void> {
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
      if (this.loggedIn === true) throw new Error("alreadyLoggedIn");
      await this.fetchAccessToken();
    },

    async fetchAccessToken(): Promise<void> {
      try {
        this.accessToken = await api.getToken();
        this.autoRefreshAccessToken();
      } catch {
        this.accessToken = null;
      }
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
      if (this.accessTokenAutoRefreshTimeout) {
        clearTimeout(this.accessTokenAutoRefreshTimeout);
      }
      await api.sendLogout(this.accessTokenPayload?.id!, this.accessToken!);
      this.accessToken = null;
    },

    async updateUsersEmail(id: number, email: string): Promise<void> {
      await api.updateEmail(id, email, this.accessToken!);
    },

    async updateUsersPassword(
      id: number,
      oldPassword: string,
      newPassword: string
    ): Promise<void> {
      await api.updatePassword(id, oldPassword, newPassword, this.accessToken!);
    },

    async updateUser(id: number, data: Partial<User>): Promise<void> {
      await api.updateUser(id, data, this.accessToken!);
      await this.fetchUser();
    },

    async fetchUser(): Promise<void> {
      this.user = await api.getUser(
        this.accessTokenPayload!.id,
        this.accessToken!
      );
    },
    async getSearchLength(query: SearchQuery): Promise<number> {
      return await api.getSearchLength(query, this.accessToken!);
    },
  },
});

export type SearchQuery = Partial<
  User & { page: string; index: string; sortby: keyof User; DESC: null }
>;
export type User = {
  email: string;
  name: string;
  postcode: string;
  city: string;
  phone: string;
  password: string;
};

export type UserWithID = User & { id: number };
