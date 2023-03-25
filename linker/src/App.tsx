import { useSearch } from "autocomplete-search-react";
import React, { useContext, useEffect, useState } from "react";
import IPInfo, { IPInfoContext } from "ip-info-react";
import emojiFlags, { EFlagKeys } from "country-flags-emoji";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

interface Link {
  id: number;
  title: string;
  url: string;
  category?: string;
}

const SearchBar = (p: {
  onTextChange: (val: string) => void;
  searchText: string;
}) => {
  return (
    <div className="bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl mx-auto">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Search..."
          value={p.searchText}
          onChange={(event) => p.onTextChange(event.target.value)}
          className="shadow-md block w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded"
        />
      </div>
    </div>
  );
};

const Banner = () => {
  const userInfo = useContext(IPInfoContext);

  return (
    <div className="bg-blue-500 text-white p-4 flex items-center justify-center">
      <div className="text-lg font-semibold">
        <span>
          Location:{" "}
          {userInfo.country_code &&
            emojiFlags.flags[userInfo.country_code as EFlagKeys].emoji}{" "}
          {userInfo.city || "Unknown"}
        </span>
        <span> | IP: {userInfo.ip || "Unknown"}</span>
        <span> | Provider: {userInfo.org}</span>
      </div>
    </div>
  );
};

const LinkList = () => {
  // Access the fetched data

  const { country_code, country_calling_code } = useContext(IPInfoContext);

  const flagData = emojiFlags.getAllCodes().map((code) => {
    return {
      code,
      ...emojiFlags.flags[code as EFlagKeys],
    };
  });

  // sort flags by names
  flagData.sort((a, b) => a.name.localeCompare(b.name));

  // call useSearch hook to get autoCompleteSearch
  const [onTextChange, filteredObjects, searchText] = useSearch({
    data: flagData,
    maxResults: 10,
    searchId: "name",
    searchKey: (obj) => {
      return obj.name + " " + obj.code;
    },
    tokenizer: " ",
  });

  const deafultCode = "US" as EFlagKeys;

  // fill autoCompleteSearch

  const [selected, setSelected] = useState(emojiFlags.flags[deafultCode]);
  // if country code changes useeffect will be called
  useEffect(() => {
    setSelected(emojiFlags.flags[(country_code || deafultCode) as EFlagKeys]);
  }, [country_code]);

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col ">
      <Banner />
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          My Links Collection
        </h1>
        <Combobox as="div" value={selected} onChange={setSelected}>
          <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
            Assigned to
          </Combobox.Label>
          <div className="relative mt-2">
            <Combobox.Input
              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(event) => onTextChange(event.target.value)}
              displayValue={(x: any) => x.name}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>

            {filteredObjects.length > 0 && (
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredObjects.map(
                  (flag) =>
                    flag && (
                      <Combobox.Option
                        key={flag?.unicode}
                        value={flag}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={classNames(
                                "block truncate",
                                selected && "font-semibold"
                              )}
                            >
                              {flag.name}
                            </span>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-indigo-600"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    )
                )}
              </Combobox.Options>
            )}
          </div>
        </Combobox>

        {/* Make a tailwind textbox here */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Phone
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={(country_calling_code || "+1") + " 123 456 789"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <IPInfo>
      <LinkList />
    </IPInfo>
  );
}

export default App;
