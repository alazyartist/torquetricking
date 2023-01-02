import { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import AccountDetails from "../../components/account/AccountDetails";
import { trpc } from "../../utils/trpc";

const AccountPage: NextPage = () => {
  const { data: session } = useSession();

  console.log(session);
  return (
    <>
      <Head>
        <title>Torque</title>
        <meta name="description" content="torquetricking.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" bg-grandeur h-full min-h-screen  w-full p-4 font-virgil">
        {session ? (
          <div className="h-full w-full">
            <div className="mt-2 font-inter text-3xl font-black text-zinc-300">
              AccountPage
            </div>
            {/* <div className="absolute top-1 right-4 text-zinc-400">
              {session.user?.email}
            </div> */}
            <div className="flex gap-2">
              <Link href={"/"}>
                <button className="font-titan text-xl text-zinc-300">
                  Home
                </button>
              </Link>
              <Link href={"/shop"}>
                <button className="font-titan text-xl text-zinc-300">
                  Shop
                </button>
              </Link>
            </div>
            <AccountDetails user={session.user} />
          </div>
        ) : (
          <div className="bg-grandeur flex min-h-screen flex-col place-content-center place-items-center">
            <div className="absolute top-20 flex gap-2">
              <Link href={"/"}>
                <button className="font-titan text-xl text-zinc-300">
                  Home
                </button>
              </Link>
              <Link href={"/shop"}>
                <button className="font-titan text-xl text-zinc-300">
                  Shop
                </button>
              </Link>
            </div>
            <div className="text-center font-inter text-3xl font-black text-zinc-300">
              You need to be <br />
              logged in
              <br /> to see that
            </div>
          </div>
        )}
      </main>
      <button
        className={`fixed  rounded-md border border-black bg-violet-50 font-virgil  ${
          session
            ? "text-2xs bottom-5 left-5 px-2 py-1"
            : "bottom-[25%] left-[40%] px-4 py-2 text-xl"
        } shadow-lg hover:bg-violet-100`}
        onClick={session ? () => signOut() : () => signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </>
  );
};

export default AccountPage;
