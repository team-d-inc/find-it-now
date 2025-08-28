"use client";

import React from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import useLayoutType from "@/hooks/useLayoutType";

export const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const { showFooter } = useLayoutType();

  return (
    <>
      <Header />
      <div className="p-4">{children}</div>
      {showFooter && <Footer />}
    </>
  );
};
