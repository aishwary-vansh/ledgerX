import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const grow = () => {
      if (dotRef.current)  { dotRef.current.style.width = "17px"; dotRef.current.style.height = "17px"; }
      if (ringRef.current) { ringRef.current.style.width = "50px"; ringRef.current.style.height = "50px"; }
    };
    const shrink = () => {
      if (dotRef.current)  { dotRef.current.style.width = "10px"; dotRef.current.style.height = "10px"; }
      if (ringRef.current) { ringRef.current.style.width = "34px"; ringRef.current.style.height = "34px"; }
    };

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("button, a, [role='button'], .nav-item, select").forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;
