import React from "react";
import { ExaminationProvider } from "./context"; // Provider import karo

export default function ExaminationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExaminationProvider>
      {children}
    </ExaminationProvider>
  );
}