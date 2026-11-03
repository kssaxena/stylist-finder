import { FaEdit } from "react-icons/fa";

const Button = ({
  LabelName = "",
  onClick,
  className = "",
  type = "button",
  variant = "primary",
  enableIcon = false,
  disabled = false,
}) => {
  const Primary = "bg-[#8B2954] text-white";
  const Secondary = "bg-white text-black border border-[#8B2954] shadow-md ";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${variant === "primary" ? Primary : Secondary} heading capitalize text-wrap text-center cursor-pointer flex justify-center items-center h-fit px-4 py-2 rounded-xl`}
    >
      {LabelName} {enableIcon === true ? <FaEdit /> : ""}
    </button>
  );
};

export default Button;
