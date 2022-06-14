import { ref, onMounted, onUnmounted, watchEffect, type Ref } from "vue";
import { useRoute, useRouter, type LocationQuery } from "vue-router";
import {
  contactDataKeys,
  emailKeys,
  type ContactData,
  type Email,
  type SearchQuery,
} from "./types";

export const pageSizes = ["10", "20", "50"];

export const textInputKeys = [...contactDataKeys, ...emailKeys];

const isValidPage = (x: any) =>
  x && typeof x === "string" && pageSizes.includes(x);

const isValidIndex = (x: any) =>
  x && typeof x === "string" && !isNaN(parseInt(x)) && parseInt(x) >= 0;

const isValidSortBy = (x: any) =>
  x && typeof x === "string" && textInputKeys.includes(x as any);

export function useSearchQuery() {
  const route = useRoute();
  const router = useRouter();

  const query: Ref<SearchQuery | null> = ref(null);

  const fetchQuery = (inputQuery: LocationQuery) => {
    const newQuery: SearchQuery = {};

    //get text input fields if there are strings and not empty
    textInputKeys.forEach((key) => {
      const value = inputQuery[key];
      if (value && typeof value === "string" && value.length > 0) {
        newQuery[key as keyof Email | keyof ContactData] = value;
      }
    });

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

    console.log(inputQuery);
    console.log(newQuery);

    if (JSON.stringify(newQuery) != JSON.stringify(inputQuery)) {
      console.log("do");
      router.replace({ path: route.path, query: newQuery });
    } else {
      query.value = newQuery;
    }
  };

  watchEffect(() => {
    if (route.path === "/search") {
      fetchQuery({ ...route.query });
    }
  });

  return { query };
}
