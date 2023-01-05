import { MdClose } from "react-icons/md";
import React, { FormEvent, useEffect, useState } from "react";
import { FaAddressCard, FaCheckCircle } from "react-icons/fa";

import { trpc } from "../../utils/trpc";
import { Recipient } from "../shop/ShopDisplay";
import { useCart } from "../shop/CartStore";
const AddressFormGuest: React.FC<any> = ({ showAddress, createUser }) => {
  const [address, setAddress] = useState<any | Recipient | undefined>({
    country_code: "US",
    address1: "",
    address2: "",
    city: "",
    country_name: "United States ",
    email: "",
  });

  const { data: userDetails } = trpc.auth.getUserDetails.useQuery();
  const saveAddressLocal = useCart((s) => s.setAddress);
  const { data: countryCodes } = trpc.shop.getCountryCode.useQuery();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("save", address);
    saveAddressLocal(address);
    createUser(address);
    showAddress(false);
  };

  const [states, setStates] = useState<any>();
  useEffect(() => {
    setStates(
      countryCodes?.result?.find((c: any) => c.code === address.country_code)
        .states
    );
  }, [countryCodes, address]);

  useEffect(() => {
    if (userDetails) {
      setAddress({ ...userDetails });
      //@ts-ignore
      document.getElementById("stateDropdown").value = userDetails?.state_code;
      //@ts-ignore
      document.getElementById("country").value = userDetails?.country_code;
    }
  }, [userDetails]);

  const disableSave =
    address.email === "" ||
    address.address1 === "" ||
    address.name === "" ||
    address.city === "" ||
    address.state_code === "" ||
    address.state_name === "" ||
    address.zip === "" ||
    address.country_code === "";
  return (
    <div className="h-full w-full md:w-[30vw]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 text-zinc-900"
      >
        {status === "success" && (
          <FaCheckCircle className="place-self-center fill-emerald-500 text-5xl" />
        )}
        {/* {isSuccess && (
            <FaCheckCircle className="place-self-center fill-emerald-500 text-5xl" />
          )} */}
        {status === "error" && (
          <MdClose className="place-self-center fill-red-500 text-5xl" />
        )}
        <label className=" flex flex-col text-zinc-300">
          Email
          <input
            autoComplete="email"
            className="rounded-md bg-opacity-30 p-2 text-zinc-800"
            type={"email"}
            value={address?.email}
            onChange={(e) => setAddress({ ...address, email: e.target.value })}
          />
        </label>
        <label className=" flex flex-col text-zinc-300">
          Name
          <input
            autoComplete="name"
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.name}
            onChange={(e) => setAddress({ ...address, name: e.target.value })}
          />
        </label>
        <label className=" flex flex-col text-zinc-300">
          Address <span className="text-xs">line-1</span>
          <input
            autoComplete="address-line1"
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.address1}
            onChange={(e) =>
              setAddress({ ...address, address1: e.target.value })
            }
          />
        </label>
        <label className=" flex flex-col text-zinc-300">
          Address <span className="text-xs">line-2</span>
          <input
            autoComplete="address-line2"
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.address2}
            onChange={(e) =>
              setAddress({ ...address, address2: e.target.value })
            }
          />
        </label>
        <label className=" flex flex-col text-zinc-300">
          City
          <input
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
        </label>

        <label className=" flex flex-col text-zinc-300">
          Zip Code
          <input
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
          />
        </label>

        <label className=" flex flex-col text-zinc-300">
          State Name
          <input
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.state_name}
            onChange={(e) =>
              setAddress({ ...address, state_name: e.target.value })
            }
          />
        </label>

        <label className=" flex flex-col text-zinc-300">
          State
          <select
            className="rounded-md bg-opacity-30 p-2"
            id="stateDropdown"
            onChange={(e) => {
              setAddress({
                ...address,
                state_code: e.target.value,
              });
            }}
            style={{ color: "#000000" }}
          >
            {states &&
              states?.map((option: { code: string; name: string }) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
          </select>
        </label>
        <label className=" flex flex-col text-zinc-300">
          Country
          <select
            className="rounded-md bg-opacity-30 p-2"
            id="country"
            onChange={(e) => {
              setAddress({
                ...address,
                country_code: e.target.value,
              });
            }}
            style={{ color: "#000000" }}
          >
            {countryCodes &&
              countryCodes?.result?.map(
                (option: { code: string; name: string }) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                )
              )}
          </select>
        </label>
        <button
          disabled={disableSave}
          className={`w-fit place-self-center rounded-xl bg-zinc-800 px-4 py-2 ${
            disableSave
              ? "bg-red-500 text-lg text-zinc-200"
              : "bg-emerald-500 text-2xl text-zinc-200"
          }`}
          type="submit"
        >
          {!disableSave ? "Save" : "Complete Form to Save"}
        </button>
      </form>
    </div>
  );
};
export default AddressFormGuest;
