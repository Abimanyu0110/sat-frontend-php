
const Checkbox = ({
  label,
  name,
  value = false,
  onChange,
  disabled = false,
}) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        checked={!!value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 cursor-pointer"
      />
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
};

export default Checkbox;
