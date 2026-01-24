
import React from 'react';

interface Option {
  label: string;
  icon?: string;
}

interface CheckboxGroupProps {
  title: string;
  options: Option[];
  selected: string[];
  onChange: (value: string) => void;
  iconClass?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, options, selected, onChange, iconClass }) => {
  return (
    <div className="mb-6">
      <h4 className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-widest mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.label);
          return (
            <button
              key={opt.label}
              onClick={() => onChange(opt.label)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                isSelected 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-500' 
                  : 'bg-[#0f172a] border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <i className={`${opt.icon || iconClass || 'fas fa-check-circle'} ${isSelected ? 'text-amber-500' : 'text-slate-600'}`}></i>
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxGroup;
