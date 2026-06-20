import React from "react";

/**
 * Reusable Button component for standard interactive elements.
 * @param {object} props
 * @param {'primary' | 'secondary' | 'danger' | 'outline'} [props.variant] - Button color variant
 * @param {'sm' | 'md' | 'lg'} [props.size] - Button padding/font size
 * @param {boolean} [props.disabled] - Disabled state
 * @param {string} [props.className] - Additional CSS class overrides
 * @param {React.ReactNode} props.children - Button label / elements
 */
const Button = ({
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
