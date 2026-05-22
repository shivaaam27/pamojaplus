export function AmbientOrbs() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-green/20 blur-3xl animate-floatA motion-reduce:animate-none" />
      <div className="absolute top-40 -right-20 w-[360px] h-[360px] rounded-full bg-yellow/30 blur-3xl animate-floatB motion-reduce:animate-none" />
    </div>
  );
}
