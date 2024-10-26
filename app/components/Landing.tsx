"use client";
import React, { useEffect, useRef, useState } from "react";
import VNDisplay from "./VNDisplay";
import { labelType, listLabelsType, userType, vnListType, vnType } from "../types";
import Checkbox from "./Checkbox";
import UsernameInput from "./UsernameInput";
import LabelDropdown from "./LabelDropdown";
import { useForm } from "react-hook-form";
import { register } from "module";
import SubmitButton from "./Button";
import VNArea from "./VNArea";

export const Landing = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  // Text inputs and dropdowns
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string | number>("");
  // const [isReleasedOnlyChecked, setIsReleasedOnlyChecked] = useState<boolean>(false);

  // Forms
  const [formData, setFormData] = useState<any>("");

  // Misc
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const previousUser = useRef<userType>(null);
  const previousSelectedLabel = useRef<string | number>("");
  const hasUserChanged = user !== previousUser.current;

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
      setUser(currentUser);
    } catch (err) {
      setError(err as string);
    }

    if (currentUser === null) {
      setLoading(false);
      setError(`User ${usernameInput} not found.`);
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

  // Text inputs and dropdowns
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(event.target.value);
  };
  // const handleCheckboxChange = (checked: boolean) => {
  //   setIsReleasedOnlyChecked(checked);
  // };

  // Misc
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const setRandomVn = (label: any) => {
    fetchList(label);
  };

  // console.log(errors.username?.message);

  return (
    <div className="w-2/3 mx-auto text-center content-center bg-blue-200 p-3 rounded-md my-2 flex flex-col gap-2">
      <form
        onSubmit={handleSubmit((data) => {
          fetchUserAndLabels(data.username);
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
          console.log(data);
          if (data.label == "") return;
          if (JSON.stringify(data) != JSON.stringify(formData)) {
            // new list, new fetch //TODO: change if-else to more readable format via functions
            // TODO: add some indicator of which user it is. besides the "Hi" message ig. 
            // TODO: should it actually do this, or should it just fetch a new list every time?
            // TODO: it feels like since i'm just gonna spam wishlist, it might be better to not do it? idk.
            console.log("Fetching");
            setRandomVn(data.label);
          } else if (list) {
            console.log("Repeat");
            setRandomNumber(Math.floor(Math.random() * list.length));
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
            disabled={!user || loading}
            fullWidth={true}
            customClasses={`${user !== null && selectedLabel ? "bg-green-200" : ""}`}
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

      {user !== null && !loading && <p>{`Hi, ${user?.username}!`}</p>} 
      {/* //TODO: handle user change in both Hi message and list */}
      {/* //TODO: actually maybe the hi message should stay? */}
      {/* //TODO: maybe i can make the get user button highlight green when it's focused? */}
      {list && <VNArea list={list} selectedLabel={formData.label} listLabels={listLabels} randomNumber={randomNumber}/>}
      
      {/* {list && list.length === 0 && !loading && (
        <div>
          <p>There doesn't seem to be anything here?</p>
          <p>{`Go add stuff to your ${listLabels !== null ? listLabels[(previousSelectedLabel.current as number) - 1].label : ""} list!`}</p>
        </div>
      )} */}
      
      {/* //TODO: handle empty list */}
      {/* //TODO: add changelog and/or git link */}
      {/* //TODO: button/page^ to mention tidbits (ex. refresh for update...) */}
      {/* //TODO: add language/release date features */}
      {/* //TODO: add check for repeat rng */}
      {loading && <p>Loading..</p>}
      {error}
    </div>
  );
};
