// app/homepage/layout.tsx
import { ReactNode } from "react";
import React from "react";
import Navbar from "../customComponents/Navbar";

export default function HomepageLayout({ children }: { children: ReactNode }) {
  return (
    <section className="w-full ">
      {/* Local layout for Homepage */}
        <Navbar />
      <div className="bg-white shadow rounded-lg ">
        {children}
      </div>
    </section>
  );
}
