import React, { useEffect, useState } from "react";
import { createBrowserHistory } from "history";
import qs from "qs";
import { filterProducts } from "../../services/filterProducts";
import DATA from "../../mock_data.json";
import {
  EXACT_SEARCH,
  SEARCH,
  STRING_REGEX,
  TITLE,
  TRIM_STRING_REGEX,
} from "../../Constants/Constants";
import "./styles.css";

export default function Feed() {
  const [feedList, setFeedList] = useState(DATA);
  const [filters, setFilters] = useState({});
  const history = createBrowserHistory();

  useEffect(() => {
    const filterParams = history.location.search.substr(1);
    const filterFromParams = qs.parse(filterParams, { comma: true });
    setFilters(filterFromParams);
  }, []);

  useEffect(() => {
    const { exactSearch, search, sort } = filters;
    if (Object.keys(filters).length && (exactSearch !== "" || search !== "")) {
      const products =
        search && Object.keys(search)?.length
          ? filterProducts(SEARCH, search, sort)
          : filterProducts(EXACT_SEARCH, exactSearch, sort);

      setFeedList(products);
    } else {
      setFeedList(DATA);
      filterProducts(null, null, filters.sort || TITLE);
    }
  }, [filters]);

  useEffect(() => {
    syncFiltersWithURL();
  }, [filters]);

  const syncFiltersWithURL = () => {
    const stringifiedFilterParams = qs.stringify(filters, {
      arrayFormat: "comma",
    });

    history.push({
      search: `?${stringifiedFilterParams}`,
    });
  };

  const filterList = (e) => {
    const searchText = e.target.value;
    const currentFilter = filters;
    let filter = {};

    if (searchText === "") {
      filter = { exactSearch: "", search: "", sort: currentFilter.sort };
      setFilters(filter);
      return;
    }
    filter = STRING_REGEX.test(searchText)
      ? {
          ...currentFilter,
          exactSearch: searchText.replace(TRIM_STRING_REGEX, ""),
          search: "",
          sort: TITLE,
        }
      : {
          ...currentFilter,
          search: searchText,
          exactSearch: "",
          sort: currentFilter.sort,
        };

    setFilters(filter);
  };

  const onSort = (e) => {
    const value = e.target.value;
    let filter = filters;
    if (value === "title") {
      filter = { ...filter, sort: TITLE };
    } else {
      filter = { ...filter, sort: "date" };
    }
    setFilters(filter);
  };

  return (
    <div>
      <div className="header">
        <div>
          <input type="text" onChange={filterList} />
        </div>

        <div className="search">
          <div>Sort By</div>
          <div>
            <select name="title" id="title" onChange={onSort}>
              <option value="title">Title</option>
              <option value="date">Modified Date</option>
            </select>
          </div>
        </div>
      </div>

      <div className="feed">
        {feedList?.map((feed, idx) => {
          return <Card feed={feed} idx={idx} />;
        })}
      </div>
    </div>
  );
}
