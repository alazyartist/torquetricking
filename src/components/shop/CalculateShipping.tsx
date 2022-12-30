import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { SyncVariant } from "../../types/SyncVariant";
import { Recipient } from "./ShopDisplay";
interface CalculateShippingProps {
  variant: SyncVariant;
  setRecipient: () => void;
  recipient: Recipient;
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
  const handleSelect = (cC) => {
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
  }, []);
  return (
    <div>
      <div onClick={() => setShowCodes(!showCodes)}>{selectedCode}</div>
      {showCodes && (
        <div className="h-[20vh] overflow-y-scroll">
          {countryCodes &&
            countryCodes?.result?.map((cC) => (
              <div
                className="flex justify-between"
                onClick={() => handleSelect(cC)}
              >
                <div>{cC.name}</div>
                <div>{cC.code}</div>
              </div>
            ))}
        </div>
      )}
      <div>{JSON.stringify(shippingCost)}</div>
    </div>
  );
};

export default CalculateShipping;
