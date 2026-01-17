// WindowSizeContext.js
import { createContext, useContext, useEffect, useState } from 'react';

interface WindowSizeContextType {
  size: { width: number; height: number };
  isHorizontal: boolean;
}

const WindowSizeContext = createContext<WindowSizeContextType>({
  size: { width: 0, height: 0 },
  isHorizontal: false
});

export const WindowSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isHorizontal, setIsHorizontal] = useState(window.innerWidth >= 768); // 根据需要调整断点
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setIsHorizontal(window.innerWidth >= 768)
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowSizeContext.Provider value={{ size, isHorizontal }}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export const useWindowSize = () => useContext(WindowSizeContext);