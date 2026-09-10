import { ReactNode, forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink-secondary">
          {label}
          {props.required && <span className="text-accent-pink ml-0.5">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-xl border bg-surface-muted px-3 py-2.5 text-sm text-ink placeholder-ink-muted transition-all duration-200
              ${icon ? "pl-10" : ""}
              ${
                error
                  ? "border-accent-pink focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20"
                  : "border-border focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 hover:border-border-hover"
              } focus:outline-none ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-accent-pink">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;

// Select component
interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function FormSelect({ label, value, onChange, options, error, required, placeholder, className = "" }: FormSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink-secondary">
        {label}
        {required && <span className="text-accent-pink ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border bg-surface-muted px-3 py-2.5 text-sm text-ink transition-all duration-200
          ${
            error
              ? "border-accent-pink focus:border-accent-pink"
              : "border-border focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 hover:border-border-hover"
          } focus:outline-none ${className}`}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-accent-pink">{error}</p>}
    </div>
  );
}

// Textarea component
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink-secondary">
          {label}
          {props.required && <span className="text-accent-pink ml-0.5">*</span>}
        </label>
        <textarea
          ref={ref}
          className={`w-full rounded-xl border bg-surface-muted px-3 py-2.5 text-sm text-ink placeholder-ink-muted transition-all duration-200 resize-vertical
            ${
              error
                ? "border-accent-pink focus:border-accent-pink"
                : "border-border focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 hover:border-border-hover"
            } focus:outline-none min-h-[80px] ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-accent-pink">{error}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
