"use client";

type Props = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
};

export function MultiSelect({ label, options, selected, onChange }: Props) {
  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                active
                  ? "border-accent bg-accent text-surface"
                  : "border-warm-border bg-surface text-ink"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
