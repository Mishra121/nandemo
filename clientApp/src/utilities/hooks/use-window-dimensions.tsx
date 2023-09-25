import { useState, useEffect, useCallback } from "react";

const useWindowDimensions = () => {
  const hasWindow = typeof window !== "undefined";

  const getWindowDimensions = useCallback(() => {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }, [hasWindow]);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const handleResize = useCallback(() => {
    setWindowDimensions(getWindowDimensions());
  }, [getWindowDimensions]);

  useEffect(() => {
    if (hasWindow) {
      window.addEventListener("resize", handleResize);
    }
  }, [getWindowDimensions, handleResize, hasWindow]);

  return windowDimensions;
};

export default useWindowDimensions;
