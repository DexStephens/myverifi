import { useRef, useEffect } from "react";
import { Box, BoxProps } from "@mui/material";

export default function HomeSection({ children, sx, ...props }: BoxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.classList.add("visible");
        } else {
          // ref.current?.classList.remove("visible"); // Optional if you want to reverse the effect
        }
      },
      {
        threshold: 0.33,
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
    <Box className="home-section" ref={ref} sx={{ py: 4, ...sx }} {...props}>
      {children}
    </Box>
  );
}