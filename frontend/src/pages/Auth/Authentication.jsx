import React from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import Login from "../../components/Login";
import Register from "../../components/Register";
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa";
import Button from "../../components/Button";
import { FiUser } from "react-icons/fi";

function Authentication() {
  const { userType, type } = useParams("");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const userRole = user?.role.toLowerCase();

  // if(type === "" )
  if (type !== "login" && type !== "register") {
    return <Navigate to="/auth/login" replace />;
  }

  return user ? (
    <div className="h-[80vh] flex flex-col justify-center items-center w-full ">
      <h1 className="heading capitalize px-5 text-center">
        You are already logged in, please navigate to dashboard or Home.{" "}
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          LabelName={
            <h1 className="flex justify-center items-center gap-2">
              <FaHome />
              Home
            </h1>
          }
        />
        <Button
          LabelName={
            <h1 className="flex justify-center items-center ">
              <FiUser />
              Go to Dashboard
            </h1>
          }
          onClick={() => {
            navigate(userRole === "admin" ? "/admin/dashboard" : "/dashboard");
          }}
        />
      </div>
    </div>
  ) : (
    <div className="h-full flex justify-center items-center">
      {type === "login" ? <Login /> : <Register userType={userType} />}
    </div>
  );
}

export default Authentication;
