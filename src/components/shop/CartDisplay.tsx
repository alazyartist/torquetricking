import React, { useEffect, useState } from "react";
import { SyncVariant } from "../../types/SyncVariant";
import { trpc } from "../../utils/trpc";
import AddressFormGuest from "../account/AddressFormGuest";
import CartCheckout from "./CartCheckout";
import { useCart } from "./CartStore";

const CartDisplay: React.FC<{ cart: Array<SyncVariant> }> = ({ cart }) => {
  const removeFromCart = useCart((s) => s.removeFromCart);
  const address = useCart((s) => s.address);
  const [checkoutOpen, toggleCheckout] = useState<boolean>(false);
  const [openAddressForm, setOpenAddressForm] = useState<boolean>();
  const { mutateAsync: createUser, data: guestUser } =
    trpc.auth.createGuestUser.useMutation();
  const { mutateAsync: getEstimate, data: estimate } =
    trpc.shop.estimateCart.useMutation();
  useEffect(() => {
    getEstimate({ items: cart, recipient: address });
    console.log(estimate);
  }, [address, cart]);
  return (
    <div className="no-scrollbar fixed top-0 z-[99] flex h-screen w-screen flex-col place-items-center gap-2 overflow-y-scroll bg-zinc-900 p-4 font-inter">
      {cart.map((item, i) => (
        <div className="w-full rounded-md bg-zinc-300 bg-opacity-30 p-2">
          <div>{item.name}</div>
          <div className="flex place-content-center place-items-center gap-4">
            <img
              src={item.files[item.files.length - 1]?.preview_url}
              alt={"product_image"}
              className={"h-24 rounded-xl"}
            />
            <div className="flex flex-col place-items-center gap-2">
              <div className="text-3xl">{item.retail_price}</div>
              <div
                onClick={() => removeFromCart(i)}
                className="rounded-md bg-red-500 p-2 py-1 text-sm text-zinc-300"
              >
                Remove Item
              </div>
            </div>
          </div>
        </div>
      ))}
      {cart.length ? (
        <>
          <div
            onClick={() =>
              address.email === ""
                ? setOpenAddressForm(true)
                : toggleCheckout(!checkoutOpen)
            }
            className="rounded-md bg-zinc-300 p-2"
          >
            Checkout
          </div>
          {checkoutOpen && <CartCheckout recipient={address} cart={cart} />}
          {openAddressForm && (
            <div className="absolute top-[0] left-[0] h-[95vh] w-[95vw] bg-zinc-900 p-2 text-xs text-zinc-300 md:text-lg ">
              <AddressFormGuest
                createUser={createUser}
                showAddress={setOpenAddressForm}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-xl text-zinc-700">Your Cart is Empty</div>
      )}
    </div>
  );
};

export default CartDisplay;
