"use client";
import { useMottoDescription } from "./settings-provider";
export default function Motto() {
  const mottoDescription = useMottoDescription();
  return <p className="mt-2 text-amber-400 max-w-2xl">{mottoDescription}</p>;
}
