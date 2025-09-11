import React from "react";
import LayoutContent from "./layoutContent";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutContent>{children}</LayoutContent>;
}
