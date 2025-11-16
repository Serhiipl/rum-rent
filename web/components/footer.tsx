"use client";

import {
  useContactInfo,
  useSMTPSettingsEmail,
  useCompanyName,
} from "./settings-provider";

export const Footer = () => {
  const phone = useContactInfo().phone;
  const email = useSMTPSettingsEmail();
  const companyName = useCompanyName();
  return (
    <footer className="w-full bg-stone-500 text-stone-200 py-4 mt-1">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {companyName}. Wszelkie prawa
          zastrzeżone.
        </p>
        <p className="text-sm">
          Kontakt:{" "}
          <a href={`tel:${phone}`} className="underline">
            {phone}
          </a>{" "}
          | Email:{" "}
          <a href={`mailto:${email}`} className="underline">
            {email}
          </a>
        </p>
      </div>
    </footer>
  );
};
