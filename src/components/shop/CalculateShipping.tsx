import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { SyncVariant } from "../../types/SyncVariant";
import { Recipient } from "./ShopDisplay";
interface CalculateShippingProps {
  variant: SyncVariant;
  setRecipient: any;
  recipient: Recipient | undefined;
}
interface CC {
  name: string;
  code: string;
}
const CalculateShipping: React.FC<CalculateShippingProps> = ({
  variant,
  recipient,
  setRecipient,
}) => {
  const { data: countryCodes } = trpc.shop.getCountryCode.useQuery();
  const { mutateAsync: calculateShipping, data: shippingCost } =
    trpc.shop.calculateShipping.useMutation();
  const [selectedCode, selectCode] = useState("US");
  const [showCodes, setShowCodes] = useState(false);
  const [shippingOption, setShippingOption] = useState(false);
  const handleSelect = (cC: CC) => {
    selectCode(cC.code);
    setShowCodes(false);
  };
  useEffect(() => {
    if (variant) {
      calculateShipping({
        recipient: recipient,
        items: [{ quantity: 1, ...variant }],
      });
    }
    console.log(variant);
  }, [variant]);
  useEffect(() => {
    console.log(shippingOption);
  }, [shippingOption]);
  let total =
    parseFloat(variant?.retail_price) + parseInt(shippingOption?.rate);
  return (
    <div className="w-full font-inter text-zinc-800">
      <select
        onChange={(e) => setShippingOption(JSON.parse(e.target.value))}
        className="max-w-[80vw] p-2"
      >
        {shippingCost &&
          shippingCost?.result.map((option) => (
            <option
              value={JSON.stringify(option)}
              className="flex w-full justify-between"
            >
              <div>{option?.name}</div>
              <div className="font-black">{option.rate}</div>
            </option>
          ))}
      </select>
      <div className="flex gap-2 p-2 text-zinc-200">
        <div>Total:</div>
        <p className="font-bold">
          {total === NaN ? "Select Options First" : total}
        </p>
      </div>
    </div>
  );
};

export default CalculateShipping;
