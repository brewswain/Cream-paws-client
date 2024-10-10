import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Chow } from "../models/chow";
import { getAllChow } from "../api";

interface StockContextInterface {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  chows: Chow[];
  setChows: Dispatch<SetStateAction<Chow[]>>;
  populateChowList: () => void;
}

export const StockContext = createContext<StockContextInterface>({
  isLoading: false,
  setIsLoading: () => {},
  chows: [],
  setChows: () => {},
  populateChowList: () => {},
});

export const StockContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chows, setChows] = useState<Chow[]>([]);

  const populateChowList = async () => {
    setIsLoading(true);
    try {
      const response = await getAllChow();
      console.log({ response });
      setChows(response);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <StockContext.Provider
      value={{ isLoading, setIsLoading, chows, setChows, populateChowList }}
    >
      {children}
    </StockContext.Provider>
  );
};
