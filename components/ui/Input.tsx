"use client";

type InputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  backgroundImageSrc?: string;
  className?: string;
};

export default function Input({
  value,
  onChange,
  placeholder,
  backgroundImageSrc,
  className = "",
}: InputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {backgroundImageSrc && (
        <img
          src={backgroundImageSrc}
          alt=""
          className="absolute inset-0 h-full w-full"
          draggable={false}
        />
      )}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          relative z-10
          h-12 w-full
          bg-transparent
          px-6
          text-[--text-body]
          text-slate-800
          outline-none
          placeholder:text-slate-400
        "
      />
    </div>
  );
}
