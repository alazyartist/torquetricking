import { User } from "next-auth";
import React, { useEffect, useState } from "react";
import { FaAddressCard } from "react-icons/fa";
import { trpc } from "../../utils/trpc";
import { Recipient } from "../shop/ShopDisplay";
interface AccountDetailProps {
  user?: User;
}
const AccountDetails: React.FC<AccountDetailProps> = (
  props: AccountDetailProps
) => {
  return (
    <div className="font-inter text-zinc-300">
      <div>AccountDetails</div>
      <FaAddressCard />
      <div className="flex items-center gap-2">
        <Address />

        {props?.user?.email}
        {JSON.stringify(props?.user)}
      </div>
    </div>
  );
};

export default AccountDetails;

const Address: React.FC = () => {
  const [address, setAddress] = useState<any | Recipient | undefined>({
    country_code: "US",
    address1: "",
    address2: "",
    city: "",
    country_name: "",
  });
  const { data: userDetails } = trpc.auth.getUserDetails.useQuery();
  const { mutateAsync: saveAddress } = trpc.auth.setUserDetails.useMutation();
  const { data: countryCodes } = trpc.shop.getCountryCode.useQuery();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("save", address);
    saveAddress(address);
  };
  const [states, setStates] = useState();
  useEffect(() => {
    setStates(
      countryCodes?.result?.find((c) => c.code === address.country_code).states
    );
  }, [countryCodes, address]);
  return (
    <div className="w-[30vw]">
      <div>{JSON.stringify(address)}</div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 text-zinc-900"
      >
        <label className="flex flex-col">
          Name
          <input
            autoComplete="name"
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.name}
            onChange={(e) => setAddress({ ...address, name: e.target.value })}
          />
        </label>
        <label className="flex flex-col">
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
        <label className="flex flex-col">
          Address
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
        <label className="flex flex-col">
          City
          <input
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
        </label>
        <label className="flex flex-col">
          State
          <input
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.state_name}
            onChange={(e) =>
              setAddress({ ...address, state_name: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col">
          Zip Code
          <input
            className="rounded-md bg-opacity-30 p-2"
            type={"text"}
            value={address?.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
          />
        </label>

        <label className="flex flex-col">
          State
          <select
            onChange={(e) => {
              setAddress({
                ...address,
                state_code: e.target.value,
              });
            }}
            style={{ color: "#000000" }}
          >
            {states &&
              states?.map((option) => (
                <option value={option.code}>{option.name}</option>
              ))}
          </select>
        </label>
        <label className="flex flex-col">
          Country
          <select
            onChange={(e) => {
              setAddress({
                ...address,
                country_code: e.target.value,
              });
            }}
            style={{ color: "#000000" }}
          >
            {countryCodes &&
              countryCodes?.result?.map((option) => (
                <option value={option.code}>{option.name}</option>
              ))}
          </select>
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};
