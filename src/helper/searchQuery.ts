import { ref, watchEffect, type Ref } from "vue";
import { useRoute, useRouter, type LocationQuery } from "vue-router";
import {
  contactDataKeys,
  emailKeys,
  type ContactData,
  type Email,
  type SearchQuery,
} from "./types";

//available page sizes
export const pageSizes = ["10", "20", "50"];

//SearchQuery keys, witch represent a text search
export const textInputKeys = [...contactDataKeys, ...emailKeys];

//functions to validate certain query-parts

const isValidPage = (x: any) =>
  x && typeof x === "string" && pageSizes.includes(x);

const isValidIndex = (x: any) =>
  x && typeof x === "string" && !isNaN(parseInt(x)) && parseInt(x) >= 0;

const isValidSortBy = (x: any) =>
  x && typeof x === "string" && textInputKeys.includes(x as any);

// composable to parse and validate the search query
export function useSearchQuery() {
  const route = useRoute();
  const router = useRouter();

  const query: Ref<SearchQuery | null> = ref(null);

  const parseQuery = (inputQuery: LocationQuery) => {
    const newQuery: SearchQuery = {};

    //get text input fields if these are strings and not empty
    textInputKeys.forEach((key) => {
      const value = inputQuery[key];
      if (value && typeof value === "string" && value.length > 0) {
        newQuery[key as keyof Email | keyof ContactData] = value;
      }
    });

    //Get all the query options from the url (if they are valid. otherwise take default values)
    newQuery["page"] = isValidPage(inputQuery["page"])
      ? (inputQuery["page"] as string)
      : pageSizes[0];

    newQuery["index"] = isValidIndex(inputQuery["index"])
      ? (inputQuery["index"] as string)
      : "0";

    newQuery["sortby"] = isValidSortBy(inputQuery["sortby"])
      ? (inputQuery["sortby"] as keyof ContactData | keyof Email)
      : "email";

    if (inputQuery["DESC"] === null) {
      newQuery["DESC"] = null;
    }

    //if the new query and the inputQuery(from the url) are the same: the url query was valid
    if (JSON.stringify(newQuery) === JSON.stringify(inputQuery)) {
      query.value = newQuery;
    } else {
      //otherwise reload the page with the new valid query
      router.replace({ path: route.path, query: newQuery });
    }
  };

  //parses the query every time the url changes
  watchEffect(() => {
    if (route.path === "/search") {
      parseQuery({ ...route.query });
    }
  });

  //make the query accessible
  return { query };
}
