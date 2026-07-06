export function DateDivider({ label }) {
  return (
    <div className="my-1 flex items-center justify-center">
      <span className="rounded-full bg-background px-3 py-1 text-caption font-medium text-text-secondary">
        {label}
      </span>
    </div>
  );
}
