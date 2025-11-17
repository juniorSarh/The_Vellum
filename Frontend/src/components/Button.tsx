import React, { type MouseEventHandler } from "react";

interface ButtonProps {
  name?: string;
  color?: string;
  backgroundColor?: string;
  className?: string;
  icon?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  name,
  color,
  backgroundColor,
  className,
  icon,
  onClick,
}: ButtonProps) {
  return (
    <div>
      <button
        onClick={onClick}
        style={{
          background: backgroundColor,
          color: color,
          fontSize: "100%",
        }}
        className={className}
      >
        {icon && <span>{icon}</span>}
        {name}
      </button>
    </div>
  );
}
