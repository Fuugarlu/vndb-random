"use client";
import React, { useEffect, useRef, useState } from "react";

type userType = {
  username: string;
  id: string;
} | null;

type listLabelsType = labelType[] | null;

type labelType = {
  label: string;
  id: number;
  private: boolean;
};

type vnListType = vnType[] | null | [];

type vnType = {
  id: string;
  vn: {
    title: string;
    alttitle: string;
    image: {
      url: string;
    };
  };
};

export const Landing = () => {
  // API-related data
  const [user, setUser] = useState<userType>(null);
  const [listLabels, setListLabels] = useState<listLabelsType>(null);
  const [list, setList] = useState<vnListType>(null);

  // Text inputs and dropdowns
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string | number>("");

  // Misc
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const previousUser = useRef<userType>(null); 
  const previousSelectedLabel = useRef<string | number>("");
  const hasUserChanged = user !== previousUser.current;

  // Loading
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null); // need fix

  // API-related data
  const fetchUserAndLabels = async () => {
    setLoading(true);
    setError(null);
    let currentUser: userType = null;

    try {
      const response = await fetch("https://api.vndb.org/kana/user?q=" + usernameInput);
      if (!response.ok) {
        console.log("Network response not ok thing message");
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      currentUser = Object.values(result)[0] as userType;
      setUser(currentUser);
    } catch (err) {
      setError(err);
    }

    if (currentUser === null) {
      setError(`User ${usernameInput} not found.`);
      console.log("Some sort of error, idk. User not found.");
      return;
    }

    let listLabelsCurrent: listLabelsType = null;
    try {
      const response = await fetch("https://api.vndb.org/kana/ulist_labels?user=" + currentUser.id);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      listLabelsCurrent = Object.values(result)[0] as listLabelsType;
      setListLabels(listLabelsCurrent);
    } catch (err) {
      setError(err);
    }

    if (listLabelsCurrent === null) {
      setError(`Error, idk how we got here though...`);
      console.log("Error, listLabels is null.");
      return;
    }

    const containsWishlist = listLabelsCurrent.find((option: any) => option.label === "Wishlist");
    if (containsWishlist) setSelectedLabel(containsWishlist.id);
    setLoading(false);
  };
  const fetchList = async () => {
    setLoading(true);
    // setError(null);

    let allResults: vnType[] = [];
    let hasMoreData = true;
    let currentPage = 1;

    if (!user) return;

    try {
      do {
        const response = await fetch("https://api.vndb.org/kana/ulist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user.id,
            fields: "id, vn.title, vn.image.url, vn.alttitle",
            results: 100,
            page: currentPage,
            filters: ["label", "=", selectedLabel],
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        allResults = [...allResults, ...result.results];

        hasMoreData = result.more === true ? true : false;
        currentPage++;
      } while (hasMoreData === true);
      setList(allResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.log(err);
    } finally {
      setLoading(false);
    }

    setRandomNumber(Math.floor(Math.random() * allResults.length));
  };

  // Text inputs and dropdowns
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(event.target.value);
  };
  const handleLabelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLabel(event.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchUserAndLabels();
    }
  };
  // Misc
  const setRandomVn = () => {
    if (list === null || previousUser.current !== user || previousSelectedLabel.current !== selectedLabel) {
      fetchList();
      previousUser.current = user;
      previousSelectedLabel.current = selectedLabel;
    }
    else if (list !== null) {
      setRandomNumber(Math.floor(Math.random() * list.length));
    }
  }

  return (
    <div className="w-1/2 mx-auto text-center content-center bg-red-200 p-3 rounded-md">
      {/* Username */}
      <label
        htmlFor="first_name"
        className="block text-sm font-medium text-gray-900 dark:text-white text-left"
      >
        VNDB Username:
      </label>
      <div className="flex w-full gap-4">
        <div className="w-3/4">
          <input
            type="text"
            value={usernameInput}
            onChange={handleUsernameChange}
            onKeyDown={handleKeyDown}
            className="
            bg-gray-50
            border border-gray-300
            text-gray-900
        text-sm
        rounded-lg
        focus:ring-1 focus:ring-blue-500
        focus:border-1 focus:border-blue-500
        focus:outline-none
        block
        p-2.5
        w-full
        "
            placeholder="Towa"
          />
        </div>
        <button
          className="
        bg-gray-50
        border border-gray-300
        text-gray-900
    text-sm
    rounded-lg
    focus:ring-1 focus:ring-blue-500
    focus:border-1 focus:border-blue-500
    focus:outline-none
    block
    p-2.5
    w-1/4"
          onClick={() => fetchUserAndLabels()}
        >
          Get user
        </button>
      </div>

      <div>
        <label
          htmlFor="labelDropdown"
          className="block text-sm font-medium text-gray-900 dark:text-white text-left"
        >
          Search label:
        </label>
        <select
          id="labelDropdown"
          value={selectedLabel}
          onChange={handleLabelChange}
          className="
        bg-gray-50
        border border-gray-300
        text-gray-900
    text-sm
    rounded-lg
    focus:ring-1 focus:ring-blue-500
    focus:border-1 focus:border-blue-500
    focus:outline-none
    block
    p-2.5
    w-full
    "
        >
          <option
            value=""
            disabled
          >
            -- Select a label --
          </option>
          {listLabels &&
            listLabels.map((label: labelType) => (
              <option
                key={label.id}
                value={label.id}
              >
                {label.label}
              </option>
            ))}
        </select>
      </div>

      <button
        className="
        bg-gray-50
        border border-gray-300
        text-gray-900
        text-sm
        rounded-lg
        focus:ring-1 focus:ring-blue-500
        focus:border-1 focus:border-blue-500
        focus:outline-none
        block
        p-2.5
        w-full
        my-3"
        disabled={loading ? true : false}
        onClick={() => {
          setRandomVn();
        }}
      >
        {user ? "Let's goooooo" : "Select user & label"}
      </button>
      {/* </div> */}

      {/* {loading && <div>Loading...</div>} */}
      {/* {error && <div>Error: {error.message}</div>} */}
      {/* {user && <div>Data: {JSON.stringify(listLabels)}</div>} */}

      {/*  */}

      {hasUserChanged && <p>{`Hi, ${user?.username}!`}</p>}

      {!hasUserChanged && list && list.length !== 0 && (
        <div className="flex flex-col items-center">
          <p className="mb-1 text-sm">You should read: </p>
          <h1 className="text-2xl font-bold">{list[randomNumber].vn.title}</h1>
          {/* {list[randomNumber].vn.alttitle && <p>{list[randomNumber].vn.alttitle}</p>} */}
          <img
            className="max-w-lg max-h-96"
            src={list[randomNumber].vn.image.url}
          />
          <p className="mt-3 text-sm">I hear it's pretty cool.</p>
        </div>
      )}
      {!hasUserChanged && list && list.length === 0 && !loading && <div><p>There doesn't seem to be anything here?</p><p>{`Go add stuff to your ${listLabels !== null ? listLabels[(previousSelectedLabel.current as number)-1].label : ""} list!`}</p></div>}
      {error}
    </div>
  );
};
