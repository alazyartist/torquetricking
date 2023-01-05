import { User } from "next-auth";
import { FaAddressCard } from "react-icons/fa";
import React, { useState } from "react";
import AddressForm from "./AddressForm";
import OrderDetails from "./OrderDetails";
import { trpc } from "../../utils/trpc";
interface AccountDetailProps {
  user?: User;
}
const AccountDetails: React.FC<AccountDetailProps> = (
  props: AccountDetailProps
) => {
  const { data: address } = trpc.auth.getUserDetails.useQuery();
  const [seeAddress, showAddress] = useState(false);
  return (
    <div className="flex w-full flex-col font-inter text-zinc-300">
      <div className="flex items-center gap-2 place-self-center text-xl">
        <FaAddressCard />
        {props?.user?.email}
      </div>
      {address && (
        <div className="w-fit place-self-center rounded-md bg-zinc-800 bg-opacity-70 p-3 text-lg font-light drop-shadow-md">
          {address?.name}
          <br />
          {address?.address1}
          <br />
          {address?.address2 ? address.address2 + <br /> : ""}
          {address?.city}, {address.state_code}, {address.country_code}
        </div>
      )}
      <button
        className="m-2 w-fit place-self-center rounded-xl bg-zinc-800 px-4 py-2 text-xl text-zinc-200"
        onClick={() => showAddress(!seeAddress)}
      >
        Change Address
      </button>
      {seeAddress && <AddressForm showAddress={showAddress} />}
      <div className="w-full overflow-y-scroll text-sm">
        <OrderDetails />
      </div>
    </div>
  );
};

export default AccountDetails;
