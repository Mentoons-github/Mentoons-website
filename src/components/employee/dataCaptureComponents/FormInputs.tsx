type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
};

type CheckboxGroupProps = {
  label: string;
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
};

type RadioProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  from?: string;
};

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};
export const Input = ({ label, ...props }: InputProps) => (
  <div>
    <label className="block mb-1 font-semibold">{label}</label>
    <input {...props} className="w-full h-12 p-2 border rounded-lg" />
  </div>
);

export const Select = ({ label, options, ...props }: SelectProps) => (
  <div>
    <label className="block mb-1 font-semibold">{label}</label>
    <select {...props} className="w-full h-12 p-2 border rounded-lg">
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export const RadioGroup = ({ label, value, options, onChange }: RadioProps) => {
  return (
    <div>
      <label className="block mb-2 font-semibold">{label}</label>

      <div
        className={`grid grid-cols-2 ${
          options.length > 2 ? "md:grid-cols-4" : ""
        } md:pr-5 gap-3`}
      >
        {options.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer
              ${
                value === opt
                  ? "border-orange-600 bg-orange-50 text-orange-700"
                  : "border-gray-300"
              }`}
          >
            <input
              type="radio"
              checked={value === opt}
              value={opt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
              className="accent-orange-600"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export const TextArea = ({ label, value, onChange }: TextAreaProps) => {
  return (
    <div>
      <label className="block mb-2 font-semibold">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        className="w-full p-3 border rounded-lg resize-none"
      />
    </div>
  );
};

export const CheckboxGroup = ({
  label,
  options,
  value,
  onChange,
}: CheckboxGroupProps) => {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">{label}</label>

      <div
        className={`grid grid-cols-2 ${
          options.length > 2 ? "md:grid-cols-4" : ""
        } md:pr-5 gap-3`}
      >
        {options.map((option) => {
          const checked = value.includes(option);

          return (
            <label
              key={option}
              className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer
                ${
                  checked
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-gray-300"
                }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOption(option)}
                className="accent-orange-600"
              />
              {option}
            </label>
          );
        })}
      </div>
    </div>
  );
};
