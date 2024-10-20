"use client";
import React, { useRef, useState } from "react";
import VNDisplay from "./VNDisplay";
import { labelType, listLabelsType, userType, vnListType, vnType } from "../types";
import Button from "./Button";

export const Landing = () => {
  // API-related data
  const [user, setUser] = useState<userType>(null);
  const [listLabels, setListLabels] = useState<listLabelsType>(null);
  const [list, setList] = useState<vnListType>(null);

  // Text inputs and dropdowns
  const [usernameInput, setUsernameInput] = useState<string>("");
  // const [usernameInput, setUsernameInput] = useState<string|null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | number>("");

  // Misc
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const previousUser = useRef<userType>(null);
  const previousSelectedLabel = useRef<string | number>("");
  const hasUserChanged = user !== previousUser.current;

  // Loading
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // need fix

  // API-related data
  const fetchUserAndLabels = async () => {
    setLoading(true);
    setError(null);
    let currentUser: userType = null;

    try {
      const response = await fetch("https://api.vndb.org/kana/user?q=" + usernameInput);
      if (!response.ok) {
        console.log("Network response not ok");
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      currentUser = Object.values(result)[0] as userType;
      setUser(currentUser);
    } catch (err) {
      setError(err as string);
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
        console.log("Network response not ok");
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      listLabelsCurrent = Object.values(result)[0] as listLabelsType;
      setListLabels(listLabelsCurrent);
    } catch (err) {
      setError(err as string);
    }

    if (listLabelsCurrent === null) {
      setError(`Error, idk how we got here though...`);
      console.log("Error, listLabels is null.");
      return;
    }

    const containsWishlist = listLabelsCurrent.find((option: labelType) => option.label === "Wishlist");
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
          console.log("Network response not ok");
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
    } else if (list !== null) {
      setRandomNumber(Math.floor(Math.random() * list.length));
    }
  };

  return (
    <div className="w-2/3 mx-auto text-center content-center bg-blue-200 p-3 rounded-md my-2">
      {/* Username */}
      <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">VNDB Username:</label>
      <div className="flex w-full gap-4 mb-2">
        <div className="w-3/4">
          <input
            type="text"
            value={usernameInput}
            // value={usernameInput ? usernameInput : ""}
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
            placeholder="Fuugarlu"
          />
        </div>

        <Button
          onClick={fetchUserAndLabels}
          label="Get user"
          disabled={loading}
          customClasses={`${!user || user === null ? "bg-green-200" : ""}`}
        />
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
          w-full"
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

      <Button
        onClick={setRandomVn}
        disabled={loading}
        fullWidth={true}
        // customClasses="my-3"
        customClasses={`my-3 ${user !== null && selectedLabel ? "bg-green-200" : ""}`}
      >
        {user ? "Generate!" : "Select user & label"}
      </Button>
      {/*  */}

      {user !== null && hasUserChanged && <p>{`Hi, ${user?.username}!`}</p>}
      {!hasUserChanged && list && list.length !== 0 && <VNDisplay vn={list[randomNumber]} />}
      {!hasUserChanged && list && list.length === 0 && !loading && (
        <div>
          <p>There doesn't seem to be anything here?</p>
          <p>{`Go add stuff to your ${listLabels !== null ? listLabels[(previousSelectedLabel.current as number) - 1].label : ""} list!`}</p>
        </div>
      )}
      {loading && <p>Loading..</p>}
      {error}
    </div>
  );
};
