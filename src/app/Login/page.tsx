import React from "react";
import UserLoginNav from "../Components/User Components/Login/UserLoginNav";
import UserLogin from "../Components/User Components/Login/UserLogin";

const page = () => {
  return (
    <div className="grid">
    <div className="main flex flex-col items-center justify-center">
      <div className="RegisterNav w-full">
        <UserLoginNav />
      </div>

    <div className="AuthPopup RegisterPopup absolute shadow-2xl bg-white m-0 p-10 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <UserLogin />
    </div>
    </div>
    </div>
  );
};

export default page;
