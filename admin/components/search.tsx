"use client";

import { useTransition } from "react";
import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";

export function SearchInput() {
  const [isPending, startTransition] = useTransition();

  function searchAction(formData: FormData) {
    startTransition(() => {
      // Perform search logic here
      console.log(formData.get("q"));
    });
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
      {isPending && <div>Loading...</div>}
    </form>
  );
}
