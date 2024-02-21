import { createContext } from "react";

export const AppContext = createContext({
  model: {
    value: "stable-diffusion",
    label: "Stable Diffusion",
  },
  setModel: () => null,
});
