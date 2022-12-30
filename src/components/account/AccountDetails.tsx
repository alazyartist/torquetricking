import { User } from "next-auth";
import React, { useState } from "react";
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
  const [address, setAddress] = useState<any | Recipient | undefined>();
  const { data: userDetails } = trpc.auth.getUserDetails.useQuery();
  const { data: countryCodes } = trpc.shop.getCountryCode.useQuery();
  return (
    <div>
      <div>{JSON.stringify(address)}</div>
      <form className="flex flex-col gap-2 text-zinc-900">
        <input
          type={"text"}
          value={address?.address1}
          onChange={(e) => setAddress({ ...address, address1: e.target.value })}
        />
        <input
          type={"text"}
          value={address?.address2}
          onChange={(e) => setAddress({ ...address, address2: e.target.value })}
        />
        <input
          type={"text"}
          value={address?.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          type={"text"}
          value={address?.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />
        <input
          type={"text"}
          value={address?.country_code}
          onChange={(e) => setAddress({ ...address, address1: e.target.value })}
        />
        <select
          onChange={(e) => {
            setAddress({
              ...address,
              country_name: e.target.value,
            });
          }}
          style={{ color: "#000000" }}
        >
          {countryCodes &&
            countryCodes?.result?.map((option) => (
              <option value={option.name}>{option.name}</option>
            ))}
        </select>
      </form>
    </div>
  );
};
