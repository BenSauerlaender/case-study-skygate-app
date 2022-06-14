export const contactDataKeys: Array<keyof ContactData> = [
  "name",
  "postcode",
  "city",
  "phone",
];
export type ContactData = {
  name: string;
  postcode: string;
  city: string;
  phone: string;
};

export type ID = { id: number };

export const emailKeys: Array<keyof Email> = ["email"];
export type Email = { email: string };

export type Password = { password: string };

export type PublicUser = ContactData & ID & Email;

export type PrivateUser = PublicUser & Password;

export const searchQueryKeys: Array<keyof SearchQuery> = [
  ...contactDataKeys,
  ...emailKeys,
  "page",
  "index",
  "sortby",
  "DESC",
];
export type SearchQuery = Partial<
  ContactData &
    Email & {
      page: string;
      index: string;
      sortby: keyof ContactData | keyof Email;
      DESC: null;
    }
>;

export type FormInputs = Partial<{
  email: string;
  name: string;
  postcode: string;
  city: string;
  phone: string;
  oldPassword: string;
  password: string;
  passwordRepeat: string;
  readLegals: boolean;
}>;
