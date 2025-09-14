export const Footer = () => {
  return (
    <footer className="w-full bg-stone-500 text-stone-200 py-4 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} RumRent. Wszelkie prawa zastrzeżone.
        </p>
        <p className="text-sm">
          Kontakt:{" "}
          <a href="tel:+48722285139" className="underline">
            +48 722 285 139
          </a>{" "}
          | Email:{" "}
          <a href="mailto:biuro.rumrent@gmail.com" className="underline">
            biuro.rumrent@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};
