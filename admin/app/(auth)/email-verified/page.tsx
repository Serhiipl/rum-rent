import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function EmailVerifiedPage() {
  return (
    <div className="flex flex-col items-center justify-center grow p-4">
      <h1 className="mb-4 text-2xl font-bold text-green-500">
        Adres e-mail zweryfikowany!
      </h1>
      <p className="mb-4 text-gray-600">
        Twój adres e-mail został zweryfikowany. Możesz teraz zalogować
      </p>
      <Link
        href="/"
        className={buttonVariants({
          variant: "default",
        })}
      >
        Na główną
      </Link>
    </div>
  );
}
