import { defineStore } from "pinia";
import { api } from "@/helper/apiCalls";

export const useStore = defineStore({
  id: "store",
  state: () => ({
    accessToken: undefined as null | undefined | string,
    accessTokenAutoRefreshTimeout: null as null | number,
    user: null as UserWithID | null,
  }),
  getters: {
    loggedIn(): boolean | undefined {
      if (this.accessToken === undefined) return undefined;
      return this.accessToken !== null;
    },
    isAdmin(): boolean | undefined {
      return this.accessTokenPayload?.perm.includes("user:{all}:{all}");
    },
    accessTokenPayload():
      | { id: number; exp: number; perm: string }
      | undefined {
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
      this.user = null;
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
    },

    async getUser(id: number): Promise<UserWithID> {
      return await api.getUser(id, this.accessToken!);
    },
    async fetchUser(): Promise<void> {
      this.user = await this.getUser(this.accessTokenPayload!.id);
    },
    async getSearchLength(query: SearchQuery): Promise<number> {
      return await api.getSearchLength(query, this.accessToken!);
    },
    async getSearchResults(query: SearchQuery): Promise<Array<SearchResult>> {
      return await api.getSearchResults(query, this.accessToken!);
    },
    async deleteUser(id: number): Promise<void> {
      return await api.deleteUser(id, this.accessToken!);
    },
  },
});

export type SearchQuery = Partial<
  BaseUser & { page: string; index: string; sortby: keyof BaseUser; DESC: null }
>;

export type BaseUser = {
  email: string;
  name: string;
  postcode: string;
  city: string;
  phone: string;
};
export type ID = { id: number };

export type SearchResult = BaseUser & ID;

export type User = BaseUser & {
  password: string;
};

export type UserWithID = User & ID;
