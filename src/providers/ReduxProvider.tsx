"use client";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../app/store";

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default ReduxProvider;
