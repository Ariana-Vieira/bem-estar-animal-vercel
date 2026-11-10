'use client'

import style from "./CustomFiltroContainer.module.css"

interface SelectOption {
  label: string
  value: string
}

interface CustomSelectProps {
  id?: string
  placeholder?: string;
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
}


export const CustomSelect = ({
  id,
  placeholder,
  options,
  value,
  onChange,
  className=""
}: CustomSelectProps) => {

  return (
    <select
      id={id}
      className={style.selectMeet}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
        {placeholder && (
            <option value="" disabled>
                {placeholder}
            </option>
        )}

        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
            {opt.label}
            </option>
        ))}
    </select>
  )
}