import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { SyncVariant } from "../../types/SyncVariant";
import { Recipient } from "./ShopDisplay";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCart } from "./CartStore";
import AddressForm from "../account/AddressForm";
import AddressFormGuest from "../account/AddressFormGuest";

interface CalculateShippingProps {
  variant: SyncVariant;
  setRecipient: any;
  recipient: Recipient | undefined;
  total: number | string;
  shippingOption: any;
  setShippingOption: any;
  setTotal: any;
  isError: any;
  createUser: any;
}
interface CC {
  name: string;
  code: string;
}
const CalculateShipping: React.FC<CalculateShippingProps> = ({
  variant,
  recipient,
  setRecipient,
  total,
  setTotal,
  shippingOption,
  setShippingOption,
  isError,
  createUser,
}) => {
  const { data: countryCodes } = trpc.shop.getCountryCode.useQuery();
  const { mutateAsync: calculateShipping, data: shippingCost } =
    trpc.shop.calculateShipping.useMutation();
  const [selectedCode, selectCode] = useState("US");
  const [showCodes, setShowCodes] = useState(false);
  const { data: sessionData } = useSession();
  const address = useCart((s) => s.address);
  const handleSelect = (cC: CC) => {
    selectCode(cC.code);
    setShowCodes(false);
  };
  useEffect(() => {
    if (variant) {
      calculateShipping({
        recipient: recipient ? recipient : address,
        items: [{ quantity: 1, ...variant }],
      });
      if (shippingCost?.result) {
        setShippingOption(shippingCost?.result[0]);
      }
    }
    console.log(variant);
  }, [variant]);

  useEffect(() => {
    setTotal(
      (
        parseFloat(variant?.retail_price) + parseFloat(shippingOption?.rate)
      )?.toPrecision(2)
    );
  }, [shippingOption, variant]);
  const [openAddressForm, setOpenAddressForm] = useState<boolean>();
  return (
    <>
      <div className="h-full w-full font-inter text-zinc-800">
        {shippingCost && (
          <select
            onChange={(e) => setShippingOption(JSON.parse(e.target.value))}
            className="w-[100%] rounded-md p-2 text-xs"
          >
            {shippingCost?.result.map((option: any) => (
              <option
                value={JSON.stringify(option)}
                className="flex w-full max-w-[80vw] justify-between"
              >
                <div className="whitespace-pre-wrap">{option?.name}</div>
                <div className="font-black">{option.rate}</div>
              </option>
            ))}
          </select>
        )}
        <div className="flex flex-col gap-2 p-2 text-zinc-200">
          {!sessionData && address.name === "" ? (
            <>
              <button
                onClick={() => signIn()}
                className="w-full rounded-md bg-zinc-300 bg-opacity-30 p-1 text-center text-zinc-300"
              >
                Sign in to see Shipping Costs
              </button>
              <button
                onClick={() => setOpenAddressForm(!openAddressForm)}
                className="w-full rounded-md bg-zinc-300 bg-opacity-30 p-1 text-center text-zinc-300"
              >
                Add Address to see Shipping Costs
              </button>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <p className="font-virgil">w/ shipping:</p>
                <p className="font-inter font-bold">
                  {/* @ts-ignore */}
                  {total === "NaN" ? "Select Options" : total}
                </p>
              </div>
            </>
          )}
        </div>
        {openAddressForm && (
          <div className="absolute top-[0] left-[0] h-[95vh] w-[95vw] bg-zinc-900 p-2 text-zinc-300 ">
            <AddressFormGuest
              createUser={createUser}
              showAddress={setOpenAddressForm}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CalculateShipping;
