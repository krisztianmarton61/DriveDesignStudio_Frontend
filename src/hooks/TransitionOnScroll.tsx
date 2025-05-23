import { useEffect, useRef, useState } from "react";
import { Slide } from "@mui/material";

export const TransitionOnScroll = ({
  children,
  direction = "up",
  timeout = 1000,
}: {
  children: React.ReactElement;
  direction?: "up" | "down" | "left" | "right";
  timeout?: number;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered) {
          setIsScrolled(true);
          setHasEntered(true);
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -200px 0px" }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasEntered]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {
        <Slide
          ref={ref}
          direction={direction}
          in={isScrolled}
          mountOnEnter
          timeout={timeout}
        >
          {children}
        </Slide>
      }
    </div>
  );
};
