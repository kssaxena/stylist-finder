const Button = ({
  LabelName = "",
  onClick,
  className = "",
  type = "button",
  variant = "primary",
}) => {
  const Primary = "bg-[#8B2954] text-white font-light";
  const Secondary = "bg-white text-black border border-[#8B2954] shadow-md";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} ${
        variant === "primary" ? Primary : Secondary
      } text-wrap w-fit px-4 py-2 text-center text-xs rounded-full cursor-pointer`}
    >
      {LabelName}
    </button>
  );
};

export default Button;
