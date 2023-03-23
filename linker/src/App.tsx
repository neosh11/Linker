import React, { useState } from "react";
import { String2ObjectAutoCompleteSearch } from "@neosh11/autocomplete-search";

interface Link {
  id: number;
  title: string;
  url: string;
  category?: string;
}

const SearchBar = (p: {
  autoCompleteSearch: String2ObjectAutoCompleteSearch;
  completeList: any[];
  setFilteredObjects: any;
}) => {
  const [searchText, setSearchText] = useState("");

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.value === "") {
      p.setFilteredObjects(p.completeList);
      setSearchText(event.target.value);
    } else {
      p.setFilteredObjects(
        p.autoCompleteSearch.findObjects(event.target.value)
      );
      setSearchText(event.target.value);
    }
  };

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
          value={searchText}
          onChange={handleInputChange}
          className="shadow-md block w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded"
        />
      </div>
    </div>
  );
};

const LinkList = () => {
  const links: Link[] = [];

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

  // generate a string with 10 random words
  const randomWords = () => {
    let words = "";
    for (let i = 0; i < randomLength(); i++) {
      words += randomStringLetters() + " ";
    }
    return words;
  };

  // generate a lists of links with random names and urls
  for (let i = 6; i < 3000; i++) {
    links.push({
      id: i,
      // make title random
      title: randomWords(),
      url: `https://www.example${i}.com`,
    });
  }

  const searchOptions = {
    ignoreCase: true,
    objectIdProperty: "id",
    tokenizer: " ",
  };

  const autoCompleteSearch = new String2ObjectAutoCompleteSearch(searchOptions);
  // fill autoCompleteSearch
  links.forEach((link) => {
    autoCompleteSearch.insert(link.title, link);
  });

  const [filteredLinks, setFilteredLinks] = useState(links);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col sm:py-12">
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          My Links Collection
        </h1>
        <SearchBar
          autoCompleteSearch={autoCompleteSearch}
          completeList={links}
          setFilteredObjects={setFilteredLinks}
        />
        <ul className="mt-6 space-y-4">
          {filteredLinks.map((link) => (
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
    <div>
      <LinkList />
    </div>
  );
}

export default App;
