export const Footer = () => {
  const OWNER_NUMBER = process.env.COMPANY_PHONE || "+48 513 424 110";
  const OWNER_EMAIL = process.env.COMPANY_EMAIL || "biuro.rumrent@gmail.com";

  return (
    <footer className="w-full bg-stone-500 text-stone-200 py-4 mt-1">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} RumRent. Wszelkie prawa zastrzeżone.
        </p>
        <p className="text-sm">
          Kontakt:{" "}
          <a href={`tel:${OWNER_NUMBER}`} className="underline">
            {OWNER_NUMBER}
          </a>{" "}
          | Email:{" "}
          <a href={`mailto:${OWNER_EMAIL}`} className="underline">
            {OWNER_EMAIL}
          </a>
        </p>
      </div>
    </footer>
  );
};
