import { createContext, useContext } from "react";

type FlipbookContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const FlipbookContext = createContext<FlipbookContextValue>({
  isOpen: false,
  setIsOpen: () => {},
});

export function useFlipbook() {
  return useContext(FlipbookContext);
}
