"use client";

import { Provider } from "react-redux";
import { store } from "../lib/redux/utils/detailStore";

export default function DetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
