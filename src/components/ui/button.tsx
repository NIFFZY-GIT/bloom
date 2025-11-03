import * as React from "react";


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button(props: ButtonProps) {
  return (
    <button {...props} />
  );
}
