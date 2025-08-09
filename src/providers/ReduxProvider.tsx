"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../lib/redux/utils/store"; // adjust path if needed

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function Provider({ children }: ReduxProviderProps) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
