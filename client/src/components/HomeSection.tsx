import React, { useRef, useEffect } from "react";
import { Box, BoxProps } from "@mui/material";

export default function HomeSection({ children, sx, ...props }: BoxProps) {
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
        threshold: 0.5, // Trigger when 50% of the element is visible
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
    <Box className="home-section" ref={ref} sx={sx} {...props}>
      {children}
    </Box>
  );
}