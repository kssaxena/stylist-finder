import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";

function Authentication() {
  const { userType, type } = useParams("");

  // if(type === "" )
  if (type !== "login" && type !== "register") {
    return <Navigate to="/auth/login" replace />;
  }


  return (
    <div className="h-full flex justify-center items-center">
      {type === "login" ? <Login /> : <Register userType={userType} />}
    </div>
  );
}

export default Authentication;
