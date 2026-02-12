export const ScoreSelect = ({
  value = 0,
  max,
  onChange,
}: {
  value?: number;
  max: number;
  onChange: (val: number) => void;
}) => {
  const step = 0.5;
  const values = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) =>
    Number((i * step).toFixed(1)),
  );
  return (
    <div className="w-56">
      {/* RANGE */}
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />

      {/* DOTS */}
      {/* <div className="flex justify-between mt-1">
        {values.map((v) => (
          <span
            key={v}
            className={`w-2 h-2 rounded-full
              ${v <= value ? "bg-blue-600" : "bg-gray-300"}`}
          />
        ))}
      </div> */}

      {/* LABELS */}
      <div className="flex justify-between text-[10px] text-gray-600 mt-1">
        {values.map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>

      {/* CURRENT VALUE */}
      <div className="text-center text-sm font-semibold mt-1">{value}</div>
    </div>
  );
};

//  <select
//       className="border rounded px-2 py-1 text-sm"
//       value={value ?? ""}
//       onChange={(e) => onChange(Number(e.target.value))}
//     >
//       <option value="">–</option>
//       {values.map((n) => (
//         <option key={n} value={n}>
//           {n}
//         </option>
//       ))}
//     </select>
