import { useRef, type PointerEvent } from "react";
import { LoginLogo } from "./LoginLogo";
import { LoginForm } from "./LoginForm";

export function LoginCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !cardRef.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;

    cardRef.current.style.setProperty("--login-light-x", `${pointerX * 100}%`);
    cardRef.current.style.setProperty("--login-light-y", `${pointerY * 100}%`);
  }

  function resetCardPosition() {
    cardRef.current?.style.setProperty("--login-light-x", "50%");
    cardRef.current?.style.setProperty("--login-light-y", "50%");
  }

  return (
    <div className="w-full max-w-[430px]">
      <div
        ref={cardRef}
        className="login-card-frame"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetCardPosition}
      >
        <div className="login-card-beam" />
        <section className="login-card-surface" aria-labelledby="login-title">
          <LoginLogo />

          <LoginForm />
        </section>
      </div>
    </div>
  );
}
