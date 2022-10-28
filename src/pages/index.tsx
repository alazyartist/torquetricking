import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Link from "next/link";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "Dylan" });
  const getAllUsers = trpc.example.getAllUsers.useQuery();

  return (
    <>
      <Head>
        <title>Torque</title>
        <meta name="description" content="torquetricking.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="no-scrollbar bg-grandeur relative mx-auto flex h-screen min-h-screen flex-col content-start items-center p-4 font-virgil">
        <h1 className="font-inter text-5xl font-black leading-normal text-gray-300 md:text-[5rem]">
          Torque <span className="text-cyan-500">Tricking</span>
        </h1>
        <p className="text-2xl text-gray-300">
          Welcome to our work in progress:
        </p>
        <Link href={"shop"}>
          <span className="font-titan text-3xl text-zinc-300"> Shop</span>
        </Link>
        <a href={"https://trickedex.app"}>
          <span className="font-titan text-3xl text-zinc-300"> Trickedex</span>
        </a>
        <Link href={"account"}>
          <span className="font-titan text-3xl text-zinc-300"> Account</span>
        </Link>
        <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
          {hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
        </div>
        <AuthShowcase />
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

  const { data: sessionData } = useSession();

  return (
    <div className=" flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.email}
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className={`absolute bottom-5 left-5 rounded-md border border-black bg-violet-50  ${
          sessionData ? "text-2xs px-2 py-1" : "px-4 py-2 text-xl"
        } shadow-lg hover:bg-violet-100`}
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
