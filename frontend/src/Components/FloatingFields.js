import React from 'react';

const FloatingField = ({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text', // input by default
  required = false,
  options = [], // used for select
  rows = 4,     // used for textarea
  placeholder = ' ',
  ...props
}) => {
  const baseClass = `peer w-full border border-gray-400 rounded-md px-3 pt-4 pb-2 
    placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500`;

  const labelClass = `absolute left-3 -top-2 px-1 bg-white text-sm text-gray-500 transition-all
    peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
    peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500`;

  return (
    <div className="relative mt-2">
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={baseClass}
          {...props}
        />
      ) : type === 'select' ? (
          <select
            id={id}
            name={name}
            value={value || ""}  // fallback to empty string
            onChange={onChange}
            required={required}
            className={`${baseClass} bg-white`}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.value === ""}
              >
                {opt.label}
              </option>
            ))}
          </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseClass}
          {...props}
        />
      )}

      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  );
};

export default FloatingField;
