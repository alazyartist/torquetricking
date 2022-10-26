import React from "react";

const ShopDisplay: React.FC = () => {
  const TestDiv: React.FC = () => {
    return (
      <div className="flex h-full w-24 flex-col items-center rounded-md bg-zinc-900 drop-shadow-lg ">
        <div className="h-24 w-full rounded-md bg-zinc-900" />
        <div className="flex h-[1.5rem] items-center justify-around gap-2 text-xs text-zinc-300">
          <p className="text-2xs">T-shirt</p>
          <p>8$</p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <TestDiv />
      <TestDiv />
      <TestDiv />
      <TestDiv />
    </div>
  );
};

export default ShopDisplay;
