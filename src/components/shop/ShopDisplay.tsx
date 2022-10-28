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
          <div className="flex h-[1.5rem] w-full items-center gap-2 p-2 text-left text-xs text-zinc-300">
            <p className="text-2xs">{name}</p>
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
  let colorRegex = /^(\w+.\s)*\-|(\/\s\w+)$/gim;
  let sizeRegex = /^(\w+.\s)*\-\s(\w+\s)*\//gim;
  const [showOptions, setShowOptions] = useState(false);
  const [color, setColor] = useState("");
  const [colorOptions, setColorOptions] = useState<Array<string>>([]);
  const [sizeOptions, setSizeOptions] = useState<Array<string>>([]);
  const [variant, setVariant] = useState<SyncVariant | undefined>();
  const [size, setSize] = useState([]);
  useEffect(() => {
    if (color === "") {
      setColor(item?.sync_variants[0].name.replace(colorRegex, ""));
    }
    let colorSet = new Set(
      item?.sync_variants.map((v: SyncVariant) =>
        v.name.replace(colorRegex, "")
      )
    );
    setColorOptions([...colorSet] as string[]);
  }, [item]);
  return (
    <div className="absolute top-20 left-20 z-20 flex h-[80vh] w-[80vw] flex-col items-center bg-zinc-900 p-2 text-zinc-300">
      <MdClose
        className="absolute top-2 right-2 text-3xl"
        onClick={() => togglePopup(!popup)}
      />
      <h1 className="font-titan text-3xl ">{item?.sync_product.name}</h1>
      <div className="grid grid-flow-row grid-cols-3 p-2">
        <img
          className="col-start-3 h-[350px] w-[350px] content-center items-center rounded-md"
          src={
            variant?.files[variant?.files.length - 1]?.preview_url ||
            item?.sync_product.thumbnail_url
          }
          alt="item"
        />
        <div
          className="relative col-start-3 flex w-full justify-between p-2 font-inter font-bold text-zinc-300"
          onClick={() => setShowOptions(!showOptions)}
        >
          <div className="relative top-0 flex flex-col gap-2">
            <h1 className="">{color || "Choose a Color"}</h1>
            {showOptions && (
              <div className="absolute top-0 w-[200px] rounded-lg bg-zinc-800 p-2">
                {colorOptions.map((color) => (
                  <div
                    onClick={() => {
                      setColor(color);
                      setVariant(
                        item.sync_variants.filter(
                          (v: SyncVariant) =>
                            v.name.replace(colorRegex, "") === color
                        )[0]
                      );
                    }}
                  >
                    {color}
                  </div>
                ))}
              </div>
            )}
          </div>
          <h1>{variant?.retail_price}</h1>
        </div>
        <div className="col-start-3 grid w-fit grid-flow-row grid-cols-6 gap-2">
          {item?.sync_variants
            ?.filter(
              (v: SyncVariant) => v.name.replace(colorRegex, "") === color
            )
            .map((v: SyncVariant) => (
              <div
                onClick={() => setVariant(v)}
                className="gap-2 rounded-md bg-zinc-500 p-2 text-sm"
              >
                {v.name?.replace(sizeRegex, "")}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default ShopDisplay;
