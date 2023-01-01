import { User } from "next-auth";
import { FaAddressCard, FaCheckCircle } from "react-icons/fa";
import React, { useState } from "react";
import AddressForm from "./AddressForm";
import OrderDetails from "./OrderDetails";
interface AccountDetailProps {
  user?: User;
}
const AccountDetails: React.FC<AccountDetailProps> = (
  props: AccountDetailProps
) => {
  const [seeAddress, showAddress] = useState(false);
  return (
    <div className="flex flex-col font-inter text-zinc-300">
      <div className="text-center text-3xl">AccountDetails</div>
      <div className="flex items-center gap-2 place-self-center text-xl">
        <FaAddressCard />
        {props?.user?.email}
      </div>
      <button
        className="w-fit place-self-center rounded-xl bg-zinc-800 px-4 py-2 text-2xl text-zinc-200"
        onClick={() => showAddress(!seeAddress)}
      >
        Change Address
      </button>
      {seeAddress && <AddressForm showAddress={showAddress} />}
      <OrderDetails />
    </div>
  );
};

export default AccountDetails;
