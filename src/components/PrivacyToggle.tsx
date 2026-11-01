import React from 'react';

interface PrivacyToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const PrivacyToggle: React.FC<PrivacyToggleProps> = ({
  label,
  description,
  checked,
  onChange
}) => {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-emerald-100/70 last:border-b-0">
      <div>
        <div className="text-xs font-semibold text-gray-900">{label}</div>
        {description && <div className="text-[11px] text-gray-500">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 focus:outline-none ${
          checked ? 'bg-[#16A34A]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-150 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
