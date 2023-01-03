import React from "react";

const CartIcon = ({ cart }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="100%"
      height="100%"
      viewBox="0 0 197.7 166"
      preserveAspectRatio="xMinYMax meet"
      data-hook="svg-icon-2"
      className="absolute top-20 right-4 h-10 w-10 text-xl"
    >
      <path d="M190.9 45.9L169.9 123.4 63.5 122.4 24.6 24.8 0 24.8 5.4 19.7 31.5 16.7 73.4 115.3 160.9 114.3 183 45.9"></path>
      <circle cx="145.8" cy="148" r="15"></circle>
      <circle cx="88.8" cy="148" r="15"></circle>
      <text text-anchor="middle" x="116" y="35" fontSize="4em" dy=".48em">
        {cart.length}
      </text>
    </svg>
  );
};

export default CartIcon;
