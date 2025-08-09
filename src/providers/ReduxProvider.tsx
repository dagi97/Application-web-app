"use client";

import { Provider } from "react-redux";
import { store } from "../lib/redux/utils/store";
import { SessionProvider } from "next-auth/react";

export default function DetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider><Provider store={store}>{children}</Provider></SessionProvider>;
}
