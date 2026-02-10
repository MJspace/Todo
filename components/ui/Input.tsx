"use client";

import React from "react";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onEnter?: () => void;

  backgroundImageSrc?: string;

  className?: string;
};

export default function Input({
  value,
  onChange,
  placeholder,
  onEnter,
  backgroundImageSrc,
  className = "",
}: InputProps) {
  return (
    <div
      className={`
        relative w-full h-14
        min-w-0
        overflow-hidden rounded-full
        ${className}
      `}
    >
      {backgroundImageSrc && (
        <img
          src={backgroundImageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-fill"
          draggable={false}
        />
      )}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            onEnter();
          }
        }}
        placeholder={placeholder}
        className="
          relative z-10
          h-full w-full
          bg-transparent
          px-6
          text-slate-800
          outline-none
          placeholder:text-slate-400
        "
      />
    </div>
  );
}
