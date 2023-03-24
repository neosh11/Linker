import { useSearch } from "autocomplete-search-react";
import React, { useContext, useEffect, useState } from "react";
import IPInfo, { IPInfoContext } from "ip-info-react";
import emojiFlags, { EFlagKeys } from "country-flags-emoji";

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

// generate a number between 5 and 10
const randomLength = () => {
  return Math.floor(Math.random() * 6) + 5;
};

const randomStringLetters = () => {
  const randomLength = () => Math.floor(Math.random() * 6) + 5; // Generate a random length between 5 and 10
  const length = randomLength();
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomCharCode = Math.floor(Math.random() * 52); // Generate a random index between 0 and 51 (inclusive)
    const charCode = randomCharCode + (randomCharCode < 26 ? 65 : 71); // Convert the random index to ASCII code (65-90 for A-Z, 97-122 for a-z)
    result += String.fromCharCode(charCode);
  }

  return result;
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

// generate a string with 10 random words
const randomWords = () => {
  let words = "";
  for (let i = 0; i < randomLength(); i++) {
    words += randomStringLetters() + " ";
  }
  return words;
};

const LinkList = () => {
  // Access the fetched data

  const [links, setlinks] = useState<Link[]>([]);

  useEffect(() => {
    const _links: Link[] = [];
    // generate a lists of links with random names and urls
    for (let i = 6; i < 100; i++) {
      _links.push({
        id: i,
        // make title random
        title: randomWords(),
        url: `https://www.example${i}.com`,
      });
    }
    setlinks(_links);
  }, []);

  // call useSearch hook to get autoCompleteSearch
  const [onTextChange, filteredObjects, searchText] = useSearch({
    data: links,
    maxResults: 10,
    searchId: "id",
    searchKey: "title",
    tokenizer: " ",
  });

  // fill autoCompleteSearch

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col ">
      <Banner />
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          My Links Collection
        </h1>
        <SearchBar onTextChange={onTextChange} searchText={searchText} />
        <ul className="mt-6 space-y-4">
          {filteredObjects.map((link) => (
            <li key={link.id} className="border-b border-gray-300">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
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
