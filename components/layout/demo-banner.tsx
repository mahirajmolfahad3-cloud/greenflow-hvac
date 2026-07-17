export function DemoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-amber-400 px-4 py-2 text-sm font-medium text-amber-900">
      <svg
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      <span>Demo Mode — All actions are read-only</span>
    </div>
  );
}