type Props = {
  current: number;
  steps?: number;
};

export function Stepper({ current, steps = 4 }: Props) {
  return (
    <ol className="flex gap-2" aria-label={`Step ${current} of ${steps}`}>
      {Array.from({ length: steps }, (_, index) => {
        const step = index + 1;
        const done = step <= current;
        return (
          <li
            key={step}
            className={`h-1.5 flex-1 rounded-full ${done ? "bg-accent" : "bg-warm-border"}`}
            aria-current={step === current ? "step" : undefined}
          />
        );
      })}
    </ol>
  );
}
