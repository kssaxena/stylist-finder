import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";

function Authentication() {
  const { type } = useParams();

  if (type !== "login" && type !== "register") {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="h-full flex justify-center items-center py-14 ">
      {type === "login" ? <Login /> : <Register />}
    </div>
  );
}

export default Authentication;
