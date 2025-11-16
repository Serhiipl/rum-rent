"use client";

import { useH1 } from "./settings-provider";

export default function H1() {
  const h1Title = useH1();
  return (
    <h1 className="text-2xl sm:text-3xl font-semibold text-amber-600">
      {h1Title}
    </h1>
  );
}
