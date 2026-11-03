import { FetchData } from "../../utils/FetchFromApi";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import InputBox from "../../components/Input";
import Button from "../../components/Button";
import { addUser, clearUser } from "../../redux/slice/authSlice";
import { motion } from "framer-motion";
import { adminDashboardSection } from "../../constants/constants";
import { useToast } from "../../components/hooks/ToastContext";
import LoginSvg from "../../assets/Login.svg";
import { useNavigate } from "react-router-dom";
import { BsChevronRight } from "react-icons/bs";

const AdminAuth = ({ resetPassword = false, login = true, adminId }) => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alertSuccess, alertError, alertInfo } = useToast();
  const [otp, setOtp] = useState(false);

  const [selectedSections, setSelectedSections] = useState([]);
  const [restrictedAccess, setRestrictedAccess] = useState("");

  const formToObject = (form) =>
    Object.fromEntries(new FormData(form).entries());

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = formToObject(formRef.current);

      const response = await FetchData("admin/login", "post", data);

      const { user, tokens } = response.data.data;
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("role", user.role);

      dispatch(clearUser());
      dispatch(addUser(user));

      formRef.current.reset();
      navigate("/admin/dashboard");
    } catch (err) {
      alertError(err.response.data);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const data = formToObject(formRef.current);

      // Send section permissions only for restricted roles
      if (restrictedAccess !== "admin") {
        data.sectionList = [...selectedSections];
      } else {
        data.sectionList = [];
      }

      const response = await FetchData("admin/register/new", "post", data);

      formRef.current.reset();
      setRestrictedAccess("");
      setSelectedSections([]);
      alertSuccess(response.data.message);
    } catch (err) {
      alertError(err.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const data = formToObject(formRef.current);
      const response = await FetchData(
        "admin/password-reset/request",
        "post",
        data,
      );

      alertInfo(response.data.message);
      setOtp(true);
    } catch (err) {
      alertError(err.response.data);
    }
  };

  const handleResetPasswordOTP = async (e) => {
    e.preventDefault();

    try {
      const data = formToObject(formRef.current);
      const response = await FetchData(
        "admin/password-reset/confirm",
        "post",
        data,
      );

      formRef.current.reset();
      alertInfo(response.data.message);
      navigate("/admin/login");
    } catch (err) {
      alertError(err.response.data);
    }
  };

  const adminRegistrationInputs = [
    {
      label: "Name",
      type: "text",
      name: "name",
      placeHolder: "Full name",
    },
    {
      label: "Contact number",
      type: "text",
      name: "contactNumber",
      placeHolder: "Contact number",
    },
    {
      label: "Email",
      type: "email",
      name: "email",
      placeHolder: "Email",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      placeHolder: "Password",
    },
    {
      label: "Employee ID",
      type: "text",
      name: "employeeId",
      placeHolder: "Eg: ADM001",
    },
  ];

  const toggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  return (
    <motion.div
      key="content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {!resetPassword ? (
        login ? (
          <div className="w-full h-[90vh] flex justify-center items-center ">
            <div className="w-1/2 hidden lg:flex justify-center items-center">
              <img src={LoginSvg} alt="Login" className="w-[70%]" />
            </div>
            <form
              ref={formRef}
              onSubmit={handleLogin}
              className="w-96 border-neutral-200 border shadow-sm rounded-xl p-5"
            >
              <h1 className="heading text-2xl ">Admin Login</h1>
              <InputBox
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
              />
              <InputBox
                label="Password"
                type="password"
                name="password"
                placeholder="Password"
              />
              <Button LabelName="Submit" type="submit" />
              <p className="text-[14px] w-full flex justify-between items-center pt-10">
                <span className="flex justify-center items-center ">
                  Forgot password <BsChevronRight />
                </span>
                <span
                  className="text-blue-500 heading cursor-pointer hover:underline"
                  onClick={() => navigate("/admin/reset/password")}
                >
                  Click here to reset password
                </span>
              </p>
            </form>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleRegister}
            className="flex flex-col justify-center items-center w-full gap-4"
          >
            <h1 className="heading text-xl">New admin</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              {adminRegistrationInputs.map((i, index) => (
                <InputBox
                  key={index}
                  label={i.label}
                  type={i.type}
                  name={i.name}
                  placeholder={i.placeHolder}
                />
              ))}

              <div className="w-full py-3">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select type <span className="text-red-500">*</span>
                </label>

                <select
                  id="role"
                  name="role"
                  value={restrictedAccess}
                  onChange={(e) => setRestrictedAccess(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-neutral-50 text-gray-700 outline-none focus:ring-1 focus:ring-[#8B2954] focus:border-[#8B2954]"
                >
                  <option value="">Select</option>
                  {["admin", "subAdmin", "sales", "marketing"].map(
                    (role, index) => (
                      <option key={index} value={role} className="uppercase">
                        {index + 1}. {role}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {restrictedAccess != "admin" && (
              <div className="w-full">
                <h1 className="heading mb-3">Access for</h1>

                <div className="flex flex-wrap gap-4">
                  {adminDashboardSection.map((section, index) => {
                    const isSelected = selectedSections.includes(section.label);

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleSection(section.label)}
                        className={`border-2 rounded-2xl px-5 py-2 transition-all duration-200 ${
                          isSelected
                            ? "border-[#8B2954] bg-neutral-200 shadow-md scale-[1.02]"
                            : "border-gray-200 bg-white hover:border-[#8B2954]"
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <p className={isSelected ? "heading" : ""}>
                            {section.label}
                          </p>

                          <div
                            className={`w-6 h-6 rounded-md border-2 flex justify-center items-center ${
                              isSelected
                                ? "bg-[#8B2954] border-white"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Button LabelName="Submit" type="submit" />
          </form>
        )
      ) : (
        <div className="w-full h-[90vh] flex justify-center items-center">
          <form
            ref={formRef}
            onSubmit={
              otp === true ? handleResetPasswordOTP : handleResetPassword
            }
            className="w-1/2 border-neutral-200 border shadow-sm rounded-xl p-5"
          >
            <h1 className="heading text-2xl ">Reset Password</h1>
            <div className="grid grid-cols-2 gap-2">
              <InputBox
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
              />
              <InputBox
                label="Employee Id"
                type="text"
                name="employeeId"
                placeholder="Eg: ADM123"
              />
              <InputBox
                label="Contact number"
                type="text"
                name="contactNumber"
                placeholder="Enter your contact number"
              />
              {otp && (
                <>
                  <InputBox
                    label="New Password"
                    type="password"
                    name="newPassword"
                    placeholder="Password"
                    passwordHint
                  />
                  <InputBox
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                  />
                </>
              )}
            </div>
            {otp && (
              <div>
                <InputBox
                  placeholder="Enter the code sent to your email"
                  label="Email reset code"
                  name="otp"
                  type="text"
                />
              </div>
            )}
            <Button
              LabelName={otp ? "Reset password" : "Send reset code"}
              type="submit"
            />
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default AdminAuth;
