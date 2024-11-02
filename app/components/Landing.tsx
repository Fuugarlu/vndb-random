"use client";
import React, { useEffect, useRef, useState } from "react";
import { labelType, listLabelsType, userType, vnListType, vnType } from "../types";
import Checkbox from "./Checkbox";
import UsernameInput from "./UsernameInput";
import LabelDropdown from "./LabelDropdown";
import { useForm } from "react-hook-form";
import SubmitButton from "./Button";
import VNArea from "./VNArea";

export const Landing = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<any>({
    defaultValues: {
      // select: { value: "vanilla", label: "Vanilla" },
    },
  });

  // API-related data
  const [user, setUser] = useState<userType>(null);
  const [listLabels, setListLabels] = useState<listLabelsType>(null);
  const [list, setList] = useState<vnListType>(null);

  // Forms
  const [formData, setFormData] = useState<any>("");
  const [oldUser, setOldUser] = useState<userType>(null);

  // Misc
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const labelValue = watch("label");
  const [sameRandomNumberCount, setSameRandomNumberCount] = useState<number>(0);

  // Loading
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // need fix

  useEffect(() => {
    if (listLabels && listLabels.length > 0) {
      const containsWishlist = listLabels.find((option: labelType) => option.label === "Wishlist");
      if (containsWishlist) setValue("label", containsWishlist.id);
    }
  }, [listLabels, setValue]);

  // API-related data
  const fetchUserAndLabels = async (username: any) => {
    if (oldUser?.username == username && user) {
      return;
    }
    setLoading(true);
    setError(null);
    let currentUser: userType = null;

    try {
      // TODO update and remove usernameInput
      const response = await fetch("https://api.vndb.org/kana/user?q=" + username);
      if (!response.ok) {
        console.log("Network response not ok");
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      currentUser = Object.values(result)[0] as userType;
      setOldUser(user);
      setUser(currentUser);
      setList(null);
    } catch (err) {
      setError(err as string);
    }

    if (currentUser === null) {
      setLoading(false);
      setError(`User ${username} not found.`);
      setUser(null);
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

    setLoading(false);
  };
  const fetchList = async (label: any) => {
    setLoading(true);
    // setError(null);

    let allResults: vnType[] = [];
    let hasMoreData = true;
    let currentPage = 1;

    if (!user) return;

    //     const condition = isReleasedOnlyChecked ? ["labels", "=", selectedLabel] : ["label", "=", selectedLabel];

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
            filters: ["label", "=", label],
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

  // Misc
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // console.log(errors.username?.message);

  console.log(formData);

  return (
    <div className="w-2/3 mx-auto text-center content-center bg-blue-200 p-3 rounded-md my-2 flex flex-col gap-2">
      <form
        onSubmit={handleSubmit((data) => {
          fetchUserAndLabels(data.username);
          setFormData(data);
        })}
      >
        <div className="flex justify-between items-end gap-4">
          <UsernameInput
            readableLabel="VNDB Username:"
            register={register}
            label="username"
          />
          <SubmitButton
            disabled={loading}
            fullWidth={false}
            customClasses={`${!user ? "bg-green-200" : ""}`}
            label={"Get user"}
          />
        </div>
      </form>

      <form
        onSubmit={handleSubmit((data) => {
          if (data.label == "") return;
          if (data.label != formData.label || user != oldUser) {
            console.log("Fetching");
            setOldUser(user);
            setSameRandomNumberCount(0);
            fetchList(data.label);
          } else if (list) {
            console.log("Repeat");
            let newRandomNumber = Math.floor(Math.random() * list.length);
            if (newRandomNumber == randomNumber) {
              setSameRandomNumberCount(sameRandomNumberCount+1);
            } else {
              setRandomNumber(newRandomNumber);
              setSameRandomNumberCount(0);
            }
          } else {
            console.log("Error!"); //TODO: proper error
          }
          setFormData(data);
        })}
      >
        <div className="flex flex-col gap-4">
          <LabelDropdown
            readableLabel="Search label:"
            listLabels={listLabels}
            label="label"
            register={register}
          />

          <SubmitButton
            disabled={!(user && labelValue !== "") || loading}
            fullWidth={true}
            customClasses={`${user && labelValue !== "" ? "bg-green-200" : ""}`}
            label={user ? "Generate!" : "Select user & label"}
          />
        </div>
      </form>

      {/* <div>
        <div className="flex items-center justify-center">
        <Checkbox
        label="Released VNs only"
        checked={isReleasedOnlyChecked}
        onChange={handleCheckboxChange}
      />
          <input className="w-4 h-4 mx-2" type="checkbox" id="released-only" name="released-only" value="Bike" />
          <label htmlFor="released-only">Released VNs only</label><br />
          <input className="w-4 h-4 mx-2" type="checkbox" id="en-only" name="en-only" value="Bike" />
          <label htmlFor="en-only">EN only</label><br />
          <input className="w-4 h-4 mx-2" type="checkbox" id="jp-only" name="jp-only" value="Bike" />
          <label htmlFor="jp-only">JP only</label><br />
          <input className="w-4 h-4 mx-2" type="checkbox" id="all list?" name="all list?" value="Bike" />
          <label htmlFor="all list?">Entire list</label><br />
        </div>
      </div> */}

      {user !== null && !loading && !list && <p>{`Hi, ${user?.username}!`}</p>}
      {loading && <p>Loading..</p>}
      {error}

      {list && (
        <VNArea
          list={list}
          selectedLabel={formData.label}
          listLabels={listLabels}
          randomNumber={randomNumber}
          sameRandomNumberCount={sameRandomNumberCount}
        />
      )}

      {/* //TODO: add changelog and/or git link */}
      {/* //TODO: button/page^ to mention tidbits (ex. refresh for update...) */}
      {/* //TODO: maybe: add logged in user indicator besides hi message */}
      {/* //TODO: add info page for contact (email?) in case something breaks. title/message/howtocontactifok */}
      {/* //TODO: add language/release date features */}
    </div>
  );
};
