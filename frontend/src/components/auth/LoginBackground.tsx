export function LoginBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="login-grid absolute inset-0 opacity-40" />
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <img
        src="/Ellipse.svg"
        alt=""
        className="absolute -bottom-[260px] -left-[260px] h-[620px] w-[620px] opacity-45 blur-sm"
      />

      <img
        src="/Vector.svg"
        alt=""
        className="absolute -right-28 -top-24 w-[520px] opacity-25 blur-[1px]"
      />

      <div className="login-orbit" />
    </div>
  );
}
