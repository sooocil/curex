import { lusitana } from "@/app/fonts/fonts";
import React from "react";
import { FaStar } from "react-icons/fa";

const BetaTop = () => {
  return (
    <div className="w-full h-14 bg-purple-700 text-white text-xl flex items-center justify-center py-2 sticky top-0 left-0 z-50">
      <span className="flex items-center gap-2 bg-white/20 px-2 py-1 rounded-md text-xs font-semibold">
        <FaStar className="text-yellow-300" />
        BETA
      </span>
      <span className={`${lusitana.className } ml-3`}>
        Help us improve.{" "}
        <a href="#" className=" font-medium hover:text-gray-200">
          Try out our new Features
        </a>
      </span>
    </div>
  );
};

export default BetaTop;
