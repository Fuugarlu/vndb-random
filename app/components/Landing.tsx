"use client";
import React, { useEffect, useState } from "react";
import { labelType, listLabelsType, userType, vnListType, vnType } from "../types";
import UsernameInput from "./UsernameInput";
import LabelDropdown from "./LabelDropdown";
import { useForm } from "react-hook-form";
import SubmitButton from "./Button";
import VNArea from "./VNArea";
import Link from "next/link";
import { VNHistory } from "./VNHistory";

export const Landing = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<any>();

  // API-related data
  const [user, setUser] = useState<userType>(null);
  const [listLabels, setListLabels] = useState<listLabelsType>(null);
  const [list, setList] = useState<vnListType>(null);
  const [generatedVNs, setGeneratedVNs] = useState<any>([]);

  // Forms
  const [formData, setFormData] = useState<any>("");
  const [oldUser, setOldUser] = useState<userType>(null);

  // Misc
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const labelValue = watch("label");
  const [sameRandomNumberCount, setSameRandomNumberCount] = useState<number>(0);

  
  useEffect(() => {
    if (list && Array.isArray(list) && list[randomNumber] !== undefined) {
      setGeneratedVNs((generatedVNs: any) => [
        ...generatedVNs,
        list[randomNumber] as vnType,
      ]);
    }
  }, [list, randomNumber, sameRandomNumberCount])

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
            filters: label,
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
  const generateFilters = (data: any) => {
    const baseFilter = ["label", "=", data.label];
    const finalFilters = [baseFilter];
    if (data.releasedOnly && data.englishOnly) {
      finalFilters.push([
        "release",
        "=",
        [
          "and",
          ["released", "<=", getTodayDate()], // Example condition for released
          ["lang", "=", "en"],
        ],
      ]);
    } else if (data.releasedOnly) {
      finalFilters.push([
        "release",
        "=",
        [
          "released",
          "<=",
          getTodayDate(), // Example condition for released
        ],
      ]);
    } else if (data.englishOnly) {
      finalFilters.push([
        "release",
        "=",
        [
          "lang",
          "=",
          "en", // Example condition for released
        ],
      ]);
    }
    return finalFilters;
  };


  return (
    <div className="w-2/3 mx-auto text-center content-center bg-blue-200 p-3 rounded-md my-2 flex flex-col gap-2">
      <div>
      <p>Random VNDB Grabber by <Link href="/info" className="text-blue-600 underline hover:text-blue-800">Fuugarlu</Link></p>
      <p className="text-sm italic">(Grab a random vn from your vndb list)</p>
      </div>

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
          if (data.label != formData.label || data.releasedOnly != formData.releasedOnly || data.englishOnly != formData.englishOnly || user != oldUser) {
            console.log("Fetching");
            setGeneratedVNs([]);
            setOldUser(user);
            setSameRandomNumberCount(0);
            const filters = generateFilters(data);
            fetchList(["and", ...filters]);
          } else if (list) {
            console.log("Repeat");
            const newRandomNumber = Math.floor(Math.random() * list.length);
            if (newRandomNumber == randomNumber) {
              setSameRandomNumberCount(sameRandomNumberCount + 1);
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
        <div className="flex flex-col gap-2">
          <LabelDropdown
            readableLabel="Search label:"
            listLabels={listLabels}
            label="label"
            register={register}
          />

          <div className="flex flex-col text-left">
            <label>
              <input
                type="checkbox"
                {...register("releasedOnly")}
                className="w-4 h-4 mx-2"
              />
              Released VNs only
            </label>

            <label>
              <input
                type="checkbox"
                {...register("englishOnly")}
                className="w-4 h-4 mx-2"
              />
              English or English-translated VNs only
            </label>
          </div>

          <SubmitButton
            disabled={!(user && labelValue !== "") || loading}
            fullWidth={true}
            customClasses={`${user && labelValue !== "" ? "bg-green-200" : ""}`}
            label={user ? "Generate!" : "Select user & label"}
          />
        </div>
      </form>

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

      {list && (
        <VNHistory vns={generatedVNs}/>
      )}
    </div>
  );
};
