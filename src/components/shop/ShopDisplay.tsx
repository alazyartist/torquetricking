import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { MdClose } from "react-icons/md";
import { SyncVariant } from "../../types/SyncVariant";
interface Product {
  external_id: string;
  id: number;
  is_ignored: boolean;
  name: string;
  synced: number;
  thumbnail_url: string;
  variants: number;
}

const ShopDisplay: React.FC = () => {
  const { data: products } = trpc.shop.getItems.useQuery();
  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {products?.map((product: Product) => {
        console.log(product);
        return <ProductCard {...product} />;
      })}
    </div>
  );
};

const ProductCard: React.FC<Product> = ({
  name,
  id,
  thumbnail_url,
  is_ignored,
}) => {
  const [popup, togglePopup] = useState(false);
  return (
    <>
      {popup && <CardOverlay id={id} popup={popup} togglePopup={togglePopup} />}
      {!is_ignored && (
        <div
          key={id}
          onClick={() => togglePopup(!popup)}
          className="flex h-full w-24 flex-col items-center rounded-md bg-zinc-900 drop-shadow-lg "
        >
          <div className="h-24 w-full rounded-md bg-zinc-900">
            <img className="h-full w-full" src={thumbnail_url} alt="item" />
          </div>
          <div className="flex h-[1.5rem] items-center justify-around gap-2 text-xs text-zinc-300">
            <p className="text-2xs">T-shirt</p>
            <p>8$</p>
          </div>
        </div>
      )}
    </>
  );
};
interface CardOverlay {
  togglePopup: (a: boolean) => void;
  popup: boolean;
  id: number;
}
const CardOverlay: React.FC<CardOverlay> = ({ togglePopup, popup, id }) => {
  const { data: item } = trpc.shop.getItemsById.useQuery(id);
  console.log(item);
  let colorRegex = /^(\w+\s)*\-|(\/\s\w+)$/gim;
  let sizeRegex = /^(\w+\s)*\-\s(\w+\s)*\//gim;
  const [showOptions, setShowOptions] = useState(false);
  const [color, setColor] = useState("");
  return (
    <div className="absolute top-10 left-10 h-[80vh] w-[80vw] bg-zinc-900 text-zinc-300">
      <MdClose
        className="absolute top-2 right-2 text-3xl"
        onClick={() => togglePopup(!popup)}
      />
      {item?.sync_product.name}
      <div onClick={() => setShowOptions(!showOptions)}>Color</div>
      {showOptions && (
        <div className="no-scrollbar h-[200px] w-fit overflow-x-auto">
          {item?.sync_variants?.map((v: SyncVariant) => (
            <div className="flex gap-2">
              <div
                onClick={() => setColor(v.name?.replace(colorRegex, ""))}
                className="text-zinc-300"
              >
                {v.name?.replace(colorRegex, "")}
              </div>
              {color === v.name?.replace(colorRegex, "") && (
                <div className="text-zinc-300">
                  {v.name?.replace(sizeRegex, "")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ShopDisplay;
