"use client";

type ButtonProps = {
  src: string;
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  src,
  ariaLabel,
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <img src={src} alt="" draggable={false} className="pointer-events-none" />
    </button>
  );
}
