import { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import AccountDetails from "../../components/account/AccountDetails";
import { trpc } from "../../utils/trpc";

const AccountPage: NextPage = () => {
  const { data: session } = useSession();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();
  console.log(session);
  return (
    <>
      {session ? (
        <div className="bg-grandeur mx-auto flex min-h-screen flex-col content-start items-center p-4 font-virgil">
          <div className="mt-2 font-inter text-3xl font-black text-zinc-300">
            AccountPage
          </div>
          <div className="absolute top-1 right-4 text-zinc-400">
            {session.user?.email}
          </div>
          <Link href={"/"}>
            <button className="font-titan text-xl text-zinc-300">Home</button>
          </Link>
          <Link href={"/shop"}>
            <button className="font-titan text-xl text-zinc-300">Shop</button>
          </Link>
          <div>{secretMessage}</div>
          <AccountDetails user={session.user} />
        </div>
      ) : (
        <div>Login Motherfucker</div>
      )}
      <button
        className={`absolute bottom-5 left-5 rounded-md border border-black bg-violet-50 font-virgil  ${
          session ? "text-2xs px-2 py-1" : "px-4 py-2 text-xl"
        } shadow-lg hover:bg-violet-100`}
        onClick={session ? () => signOut() : () => signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </>
  );
};

export default AccountPage;
