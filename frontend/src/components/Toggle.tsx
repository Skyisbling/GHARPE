"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, id, disabled = false }: ToggleProps) {
  const toggleId = id || `toggle-${label?.replace(/\s/g, "-").toLowerCase()}`;

  return (
    <label htmlFor={toggleId} className="inline-flex items-center gap-3 cursor-pointer">
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 cursor-pointer ${
          checked ? "bg-brand-400" : "bg-border"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
        style={{ width: '28px', height: '14px', minHeight: '14px' }}
      >
        <span
          className={`inline-block h-2 w-2 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[14px]" : "translate-x-[3px]"
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
    </label>
  );
}
