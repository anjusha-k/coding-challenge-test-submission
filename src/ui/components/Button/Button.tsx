import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  return (
    <button
      className={`${$.button} ${variant === 'primary' ? $.primary : $.secondary}`}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading && <div className={$.spinner} data-testid="loading-spinner"></div>}
      {children}
    </button>
  );
};

export default Button;
