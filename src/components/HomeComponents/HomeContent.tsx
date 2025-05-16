import { lusitana } from "@/app/fonts/fonts";
import { Button } from "@/components/ui/button";
import { TiTick } from "react-icons/ti";

import React from "react";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import BetaTop from "./BetaTop";

const HomeContent = () => {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex flex-col  gap-2 p-2 text-4xl items-start justify-left  h-2/3">
        <h1 className={`${lusitana.className} w-1/2 text-left`}>
          The Only Cure For Your Health Problems
        </h1>
        {/* <GiPlagueDoctorProfile /> */}
        <ul>
          <li className="text-lg flex items-center">
            <span className="text-lg">
              <TiTick />
            </span>{" "}
            Identify potential health issues
          </li>
          <li className="text-lg flex items-center">
            <span className="text-lg">
              <TiTick />
            </span>{" "}
            Connect with medical experts
          </li>
          <li className="text-lg flex items-center">
            <span className="text-lg">
              <TiTick />
            </span>{" "}
            Book & manage appointments
          </li>
          <li className="text-lg flex items-center">
            <span className="text-lg">
              <TiTick />
            </span>{" "}
            Access trusted hospitals & clinics
          </li>
        </ul>
        <Button
          className="mt-10 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => (window.location.href = "/Interview/questions")}
        >
          Take Test !
        </Button>
      </div>
    <div className="flex flex-col w-full h-56 items-center justify-center ">
      <img src="/HomeDoctors.svg" className="w-full h-98 " alt="Online Doctor" />
    </div>
    </div>
  );
};

export default HomeContent;
