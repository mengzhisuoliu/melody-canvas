import { useEffect, useState } from "react";
import { BREAK_POINTS } from "@/libs/common";

const useMediaBreakpoint = (breakpoint: keyof typeof BREAK_POINTS) => {
  const query = BREAK_POINTS[breakpoint];
  const mediaQuery = window.matchMedia(query);
  const [matches, setMatches] = useState(mediaQuery.matches);

  useEffect(() => {
    if (!query) return;
    const handleMediaChange = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [query]);

  return matches;
};

export default useMediaBreakpoint;
