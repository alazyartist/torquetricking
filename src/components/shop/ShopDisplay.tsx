import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { MdClose } from "react-icons/md";
import PaymentEmbed from "../payments/PaymentEmbed";
import { SyncVariant } from "../../types/SyncVariant";
import CalculateShipping from "./CalculateShipping";
export interface Recipient {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state_code: string;
  state_name: string;
  country_code: string;
  country_name: string;
  zip: string;
  email: string;
}
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
  useEffect(() => {}, [products]);

  return (
    <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
      {products?.map((product: Product) => {
        return <ProductCard key={product.id + "Product"} {...product} />;
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
      {popup && (
        <CardOverlay key={id} id={id} popup={popup} togglePopup={togglePopup} />
      )}
      {!is_ignored && (
        <div
          key={id + "Product Card"}
          onClick={() => togglePopup(!popup)}
          className="flex h-full w-24 flex-col items-center rounded-md drop-shadow-lg hover:scale-110  "
        >
          <div className="h-24 w-full bg-zinc-700  hover:bg-transparent">
            <img
              className="h-full w-full mix-blend-multiply"
              src={thumbnail_url}
              alt="item"
            />
          </div>
          <div className="flex h-[1.5rem] w-full items-center gap-2 rounded-b-md bg-zinc-800 p-2 text-left text-xs text-zinc-300">
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
  let sizeRegex = /^(\w+.\s)*\-\s(\w+.)*\//gim;
  const [showOptions, setShowOptions] = useState(false);
  const [color, setColor] = useState("");
  const [colorOptions, setColorOptions] = useState<Array<string>>([]);
  const [sizeOptions, setSizeOptions] = useState<Array<string>>([]);
  const [variant, setVariant] = useState<SyncVariant | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [size, setSize] = useState<string>();
  const [total, setTotal] = useState<number | string>(0);
  const [shippingOption, setShippingOption] = useState<any>();

  const [recipient, setRecipient] = useState<Recipient>();
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

  const { mutateAsync: buyNow } = trpc.shop.buyNow.useMutation();
  const { data: userDetails, isError } = trpc.auth.getUserDetails.useQuery();
  //Move this to api call for after stripe process is completed
  const handleBuy = async () => {
    // buyNow({
    //   variant,
    //   recipient: userDetails,
    // });
    setShowForm(true);

    // console.log("Buying Product", userDetails, variant, color, size);
  };
  useEffect(() => {
    setRecipient(userDetails);
  });
  return (
    <div className="no-scrollbar fixed top-[2.5vh] left-[2.5vw] z-20 flex h-[95vh] w-[95vw] flex-col items-center overflow-y-auto rounded-md bg-zinc-900 bg-opacity-80 p-2 text-zinc-300 drop-shadow-2xl ">
      <MdClose
        className="absolute top-2 right-2 z-[1000] text-3xl text-zinc-300"
        onClick={() => {
          togglePopup(false);
        }}
      />
      <h1 className="font-titan text-3xl text-zinc-300 ">
        {item?.sync_product.name}
      </h1>
      <div className=" flex flex-col p-2 md:grid md:grid-cols-2 lg:grid-flow-row lg:grid-cols-2">
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
                    key={color}
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
        <div
          id="sizeOptions"
          className="col-start-3 grid w-full grid-flow-row grid-cols-6 gap-2"
        >
          {item?.sync_variants
            ?.filter(
              (v: SyncVariant) => v.name.replace(colorRegex, "") === color
            )
            .map((v: SyncVariant) => {
              let lsize = v.name?.replace(sizeRegex, "");
              if (v.main_category_id === 55) {
                return (
                  <div
                    onClick={() => {
                      setSize(lsize);
                      setVariant(v);
                    }}
                    className={`w-full gap-2 rounded-md ${
                      size === lsize ? "bg-emerald-500" : "bg-zinc-500"
                    } p-2 text-center text-sm`}
                  >
                    {v.product.name.replace("Enhanced Matte Paper Poster", "")}
                  </div>
                );
              }
              if (v.main_category_id === 24 || 29) {
                return (
                  <div
                    onClick={() => {
                      setSize(lsize);
                      setVariant(v);
                    }}
                    className={`w-full gap-2 rounded-md ${
                      size === lsize ? "bg-emerald-500" : "bg-zinc-500"
                    } p-2 text-center text-sm`}
                  >
                    {lsize}
                  </div>
                );
              }
              if (v.main_category_id === 27) {
                return (
                  <div
                    onClick={() => {
                      setSize(lsize);
                      setVariant(v);
                    }}
                    className={`w-full gap-2 rounded-md ${
                      size === lsize ? "bg-emerald-500" : "bg-zinc-500"
                    } p-2 text-center text-sm`}
                  >
                    {lsize}
                  </div>
                );
              }
            })}
        </div>
        <div className="col-start-3">
          <CalculateShipping
            isError={isError}
            setShippingOption={setShippingOption}
            shippingOption={shippingOption}
            total={total}
            setTotal={setTotal}
            variant={variant as SyncVariant}
            setRecipient={setRecipient}
            recipient={recipient}
          />
        </div>
        <button
          disabled={total === "NaN"}
          onClick={() => handleBuy()}
          className=" col-start-3 m-2 rounded-md bg-emerald-500 p-2 shadow-md shadow-emerald-600"
        >
          Buy Now
        </button>
      </div>
      {showForm && (
        <div className="absolute top-[0vh] left-[0vw] z-[10] h-[100%] w-[100%] rounded-md bg-zinc-900 bg-opacity-40 p-8 backdrop-blur-md">
          <PaymentEmbed
            shippingOption={shippingOption}
            userDetails={userDetails}
            product={variant}
            creditAmount={total}
            setShowForm={setShowForm as any}
          />
        </div>
      )}
    </div>
  );
};
export default ShopDisplay;
