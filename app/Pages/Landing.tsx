"use client";
import React, { useState } from "react";

export const Landing = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const [usernameInput, setUsernameInput] = useState("");

  const [randomNumber, setRandomNumber] = useState<number>(0);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(event.target.value);
    // test
  };

  const fetchUser = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.vndb.org/kana/user?q=" + username);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      //   setUser(result);
      setUser(Object.values(result)[0]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const [listLabels, setListLabels] = useState<any>(null);

  const fetchListLabels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.vndb.org/kana/ulist_labels?user=" + user.id);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      //   setUser(result);
      setListLabels(Object.values(result)[0]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const [list, setList] = useState<any>(null);
  const [selectedLabel, setSelectedLabel] = useState("");

  const fetchList = async (selectedLabel: String) => {
    setLoading(true);
    setError(null);

    let allResults: any[] = [];
    let hasMoreData = true; // Flag to control the loop
    let currentPage = 1;

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
        //   setList(result.results);
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

    setRandomNumber(Math.floor(Math.random() * allResults.length) + 1);
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLabel(event.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchUserAndLabels();
    }
  };

  const fetchUserAndLabels = async () => {
    // await fetchUser(usernameInput); // Fetch user data and update state
    // await fetchListLabels();        // Fetch labels and update state
    // console.log(user.id);
    // console.log(listLabels);

    let currentUser: any = null;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.vndb.org/kana/user?q=" + usernameInput);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      //   setUser(result);
      currentUser = Object.values(result)[0];
      setUser(Object.values(result)[0]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }

    if (currentUser[usernameInput] && currentUser[usernameInput] === null) {
      console.log("Some sort of error, idk. User not found.");
      return "Some sort of error, idk. User not found";
    }

    let listLabelsCurrent: any;
    // setLoading(true);
    // setError(null);
    try {
      const response = await fetch("https://api.vndb.org/kana/ulist_labels?user=" + currentUser.id);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      //   setUser(result);
      listLabelsCurrent = Object.values(result)[0];
      setListLabels(Object.values(result)[0]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }

    console.log(listLabelsCurrent);
    const containsWishlist = listLabelsCurrent.find((option: any) => option.label === "Wishlist");
    console.log(containsWishlist);
    if (containsWishlist) setSelectedLabel(containsWishlist.id);
  };

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
    w-1/4
    "
          onClick={() => fetchUser(usernameInput)}
        >
          Get user
        </button>
      </div>

      {/* {user && <p className="italic text-sm">Found you! What label do you wanna search by?</p>} */}

      {/* {loading && <div>Loading...</div>} */}
      {/* {error && <div>Error: {error.message}</div>} */}
      {/* {user && <div>Data: {JSON.stringify(user)}</div>} */}

      {/* List labels */}
      {/* <button onClick={() => fetchListLabels()}>Fetch Labels</button> */}

      {/* {loading && <div>Loading...</div>} */}
      {/* {error && <div>Error: {error.message}</div>} */}
      {/* {user && <div>Data: {JSON.stringify(listLabels)}</div>} */}

      {/*  */}

      {/* <button onClick={() => fetchList(selectedLabel)}>Fetch list</button> */}

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
            listLabels.map((label: any) => (
              <option
                key={label.id}
                value={label.id}
              >
                {label.label}
              </option>
            ))}
        </select>

        {/* Display the selected label */}
        {/* {selectedLabel && <p>Selected Label ID: {selectedLabel}</p>} */}
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
    my-3
    "
        disabled={loading ? true : false}
        onClick={() => fetchList(selectedLabel)}
      >
        {user ? "Let's goooooo" : "Select user & label"}
      </button>
      {/* </div> */}

      {/* {loading && <div>Loading...</div>} */}
      {error && <div>Error: {error.message}</div>}
      {/* {user && <div>Data: {JSON.stringify(listLabels)}</div>} */}

      {/*  */}

      {list && (
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
    </div>
  );
};
