import DATA from "../mock_data.json";
import { EXACT_SEARCH, TITLE } from "../Constants/Constants";

export const filterProducts = (searchType, key, sortType) => {
  if (searchType === EXACT_SEARCH) {
    const matchedProducts = DATA?.filter(
      (data) =>
        data?.name?.toLowerCase()?.includes(key) ||
        data?.description?.toLowerCase()?.includes(key)
    );
    return sortType
      ? matchedProducts.sort((a, b) =>
          sortType === TITLE
            ? sortByName(a, b)
            : new Date(b.dateLastEdited) - new Date(a.dateLastEdited)
        )
      : matchedProducts;
  } else if (!key) {
    return DATA.sort((a, b) =>
      sortType === TITLE
        ? sortByName(a, b)
        : new Date(b.dateLastEdited) - new Date(a.dateLastEdited)
    );
  } else {
    const matchedProducts = DATA?.filter((data) => getMatchString(data, key));
    return sortType
      ? matchedProducts.sort((a, b) =>
          sortType === TITLE
            ? sortByName(a, b)
            : new Date(b.dateLastEdited) - new Date(a.dateLastEdited)
        )
      : matchedProducts;
  }
};

export const sortByName = (a, b) => {
  return ("" + a.name).localeCompare(b.name);
};

export const getMatchString = (text, search) => {
  let obj = {};
  let isUnmatchedString = false;
  const textList = text?.name?.split(" ");
  const searchList = search.split(" ");

  textList?.map((word) =>
    obj.hasOwnProperty(word.toLowerCase())
      ? (obj[word.toLowerCase()] += 1)
      : (obj[word.toLowerCase()] = 1)
  );

  searchList?.map((item) => {
    if (obj.hasOwnProperty(item.toLowerCase()) && obj[item.toLowerCase()]) {
      obj[item.toLowerCase()] -= 1;
    } else {
      isUnmatchedString = true;
      return;
    }
  });

  return !isUnmatchedString;
};
