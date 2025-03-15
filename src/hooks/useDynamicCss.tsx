import { useEffect, useRef } from "react";

const useDynamicCss = (css: string, shouldRemove: boolean) => {
  const styleElRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!styleElRef.current) {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = css;
      styleElRef.current = styleElement;
    } else {
      styleElRef.current.innerHTML = css;
    }
  }, [css]);

  useEffect(() => {
    if (!styleElRef.current) return;

    if (!shouldRemove) {
      if (!document.head.contains(styleElRef.current)) {
        document.head.appendChild(styleElRef.current);
      }
    } else {
      if (document.head.contains(styleElRef.current)) {
        document.head.removeChild(styleElRef.current);
      }
    }

    return () => {
      if (styleElRef.current && document.head.contains(styleElRef.current)) {
        document.head.removeChild(styleElRef.current);
      }
    };
  }, [shouldRemove]);
};

export default useDynamicCss;
