import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { SyncVariant } from "../../types/SyncVariant";
import { trpc } from "../../utils/trpc";
import AddressFormGuest from "../account/AddressFormGuest";
import CartCheckout from "./CartCheckout";
import { useCart } from "./CartStore";
import { Recipient } from "./ShopDisplay";

const CartDisplay: React.FC<{ cart: Array<SyncVariant>; setCartOpen: any }> = ({
  cart,
  setCartOpen,
}) => {
  const address = useCart((s) => s.address);
  const setAddress = useCart((s) => s.setAddress);
  const guestUser = useCart((s) => s.guestUser);
  const setGuestUser = useCart((s) => s.setGuestUser);

  const [checkoutOpen, toggleCheckout] = useState<boolean>(false);
  const session = useSession();
  const [openAddressForm, setOpenAddressForm] = useState<boolean>();
  const { mutateAsync: createUser, data: guestUserResponse } =
    trpc.auth.createGuestUser.useMutation();
  const { mutateAsync: getEstimate, data: estimate } =
    trpc.shop.estimateCart.useMutation();
  useEffect(() => {
    getEstimate({ items: cart, recipient: address });
    console.log(address, guestUserResponse, session);
  }, [address, cart]);
  useEffect(() => {
    if (guestUserResponse) {
      setGuestUser(guestUserResponse.user);
      setAddress(guestUserResponse.address as Recipient);
    }
  }, [guestUserResponse]);
  const { data: userAddress } = trpc.auth.getUserDetails.useQuery() as any;
  useEffect(() => {
    if (userAddress !== null) {
      setGuestUser(userAddress?.user);
      setAddress(userAddress as Recipient);
    }
  }, [userAddress]);
  console.log(userAddress);
  return (
    <div className="no-scrollbar fixed top-0 z-[99] flex h-screen w-screen flex-col place-items-center gap-2 overflow-y-scroll bg-zinc-900 p-4 font-inter">
      <CartItemDisplay cart={cart} />
      <EstimateDisplay estimate={estimate} />
      {cart.length ? (
        <>
          <div
            onClick={() =>
              guestUser.id === ""
                ? setOpenAddressForm(true)
                : toggleCheckout(!checkoutOpen)
            }
            className={`rounded-md ${
              guestUser.id === "" ? "bg-zinc-300" : "bg-emerald-500"
            } p-2`}
          >
            {guestUser.id === "" ? "Add Address" : "Checkout"}
          </div>
          {checkoutOpen && (
            <CartCheckout
              setCartOpen={setCartOpen}
              toggleCheckout={toggleCheckout}
              user_id={guestUser.id}
              estimate={estimate}
              recipient={address}
              cart={cart}
            />
          )}
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

const CartItemDisplay: React.FC<any> = ({ cart }) => {
  const removeFromCart = useCart((s) => s.removeFromCart);

  return (
    <>
      {cart.map((item: SyncVariant, i: number) => (
        <div
          key={item.id + "cartDisplay"}
          className="w-full rounded-md bg-zinc-300 bg-opacity-30 p-2"
        >
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
    </>
  );
};

const EstimateDisplay: React.FC<any> = ({ estimate }) => {
  return (
    <div className="flex gap-2">
      <div className="flex place-content-center place-items-center gap-2 rounded-md bg-zinc-300 bg-opacity-30 p-1 text-zinc-300">
        <p className="text-xs">subtotal:</p>
        {estimate && estimate?.retail_costs?.subtotal}
      </div>
      <div className="flex place-content-center place-items-center gap-2 rounded-md bg-zinc-300 bg-opacity-30 p-1 text-zinc-300">
        <p className="text-xs">shipping:</p>
        {estimate && estimate?.retail_costs?.shipping}
      </div>
      <div className="flex place-content-center place-items-center gap-2 rounded-md bg-zinc-300 bg-opacity-30 p-1 text-zinc-300">
        <p className="text-xs">Total:</p>
        {estimate && estimate?.retail_costs?.total}
      </div>
    </div>
  );
};
