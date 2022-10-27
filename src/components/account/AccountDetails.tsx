import { User } from "next-auth";
import React from "react";
import { FaAddressCard } from "react-icons/fa";
interface AccountDetailProps {
  user?: User;
}
const AccountDetails: React.FC<AccountDetailProps> = (
  props: AccountDetailProps
) => {
  return (
    <div className="font-inter text-zinc-300">
      <div>AccountDetails</div>
      <div className="flex items-center gap-2">
        <FaAddressCard />
        {props?.user?.email}
      </div>
    </div>
  );
};

export default AccountDetails;
{
}
