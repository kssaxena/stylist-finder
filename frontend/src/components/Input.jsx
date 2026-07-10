import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputBox = ({
  label = "",
  placeholder = "",
  className = "",
  type = "text",
  name = "",
  value = "",
  onChange,
  required = false,
  disabled = false,
  onClick,
  onKeyDown,
  labelClassName = "",
  passwordHint = false,
  textarea = false,
  rows = 4,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  return (
    <div className="w-full py-3">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input */}
      {!textarea ? (
        <div className="relative">
          <input
            id={name}
            name={name}
            type={isPasswordField ? (showPassword ? "text" : "password") : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            onClick={onClick}
            onKeyDown={onKeyDown}
            className={`w-full px-4 py-2 ${
              isPasswordField ? "pr-12" : ""
            } border border-gray-300 rounded-lg bg-[#FFFDF9] text-gray-700 outline-none focus:ring-1 focus:ring-[#8B2954] focus:border-[#8B2954] transition hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
          />

          {/* Password Toggle */}
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#8B2954]"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          )}
        </div>
      ) : (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#FFFDF9] resize-none outline-none focus:ring-2 focus:ring-[#8B2954] focus:border-[#8B2954] transition hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        />
      )}

      {/* Password Hint */}
      {passwordHint && (
        <p className="mt-2 text-xs text-red-500">
          Password should be 8–20 characters and include at least one uppercase
          letter, one lowercase letter, one number, and one special character.
        </p>
      )}
    </div>
  );
};

export default InputBox;
