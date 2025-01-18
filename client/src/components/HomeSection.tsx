import React, { useRef, useEffect } from "react";

export default function HomeSection({ children }: React.ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.classList.add("visible");
        } else {
          ref.current?.classList.remove("visible"); // Optional if you want to reverse the effect
        }
      },
      {
        threshold: 0.5, // Trigger when 10% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div className="home-section" ref={ref}>
      {children}
    </div>
  );
}
