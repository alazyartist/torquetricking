import React from "react";
import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import ShopDisplay from "../../components/shop/ShopDisplay";
const Shop: NextPage = () => {
  return (
    <>
      <Head>
        <title>Torque</title>
        <meta name="description" content="torquetricking.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative mx-auto flex min-h-screen flex-col content-start items-center bg-gradient-to-t from-zinc-900 via-cyan-400 to-zinc-900 p-4 font-virgil">
        <h1 className="font-inter text-5xl font-black leading-normal text-gray-300 md:text-[5rem]">
          Torque <span className="text-cyan-500">Store</span>
        </h1>
        <p className="text-2xl text-gray-300">Welcome to our shop</p>
        <Link href={"/"}>
          <span className="font-titan text-3xl text-zinc-300">Home</span>
        </Link>
        <ShopDisplay />
      </main>
    </>
  );
};

export default Shop;
