"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useServiceStore from "@/lib/serviceStore";
import { useEffect } from "react";

const ShowSettings: React.FC = () => {
  const {
    settings,
    fetchSettings,
    settingsFetched,
    isFetchingSettings,
  } = useServiceStore();

  useEffect(() => {
    if (!settingsFetched && !isFetchingSettings) {
      fetchSettings().catch((error) =>
        console.error("Failed to load settings", error)
      );
    }
  }, [fetchSettings, isFetchingSettings, settingsFetched]);

  if (isFetchingSettings || (!settings && !settingsFetched)) {
    return <div>Ładowanie ustawień...</div>;
  }

  if (!settings) {
    return <div className="text-sm text-muted-foreground">Brak ustawień</div>;
  }

  return (
    <div className="my-6">
      <h2>Ustawienia Aplikacji</h2>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Nazwa firmy: {settings.company_name}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Nazwa firmy lub imie i nazwisko właściciela ktore będą wyświetlane
              jako dane kontaktowe na stronie internetowej.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Adres firmy: {settings.company_address}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Adres firmy lub miejsce prowadzenia działalności, które będą
              wyświetlane jako dane kontaktowe na stronie internetowej.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Telefon firmy: {settings.company_phone}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Numer telefonu firmy lub właściciela, który będzie wyświetlany
              jako dane kontaktowe na stronie internetowej.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>NIP firmy: {settings.company_nip}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Numer identyfikacji podatkowej (NIP) firmy, który może być
              wymagany do celów fakturowania i rozliczeń podatkowych.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            Email ustawień smtp: {settings.smtp_user_emailFrom}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Adres email używany do wysyłania wiadomości e-mail z aplikacji za
              pomocą protokołu SMTP. Dodatkowo może być używany jako adres
              nadawcy w wysyłanych wiadomościach e-mail. Hasło do tego adresu
              email jest przechowywane w ustawieniach SMTP w pliku ENV
              aplikacji.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            Email odbiorcy: {settings.email_receiver}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Adres email odbiorcy wiadomości wysyłanych z formularza
              kontaktowego na stronie internetowej.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>
            Motto: {settings.motto_description}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Krótkie hasło lub motto firmy, które może być wyświetlane na
              stronie internetowej jako główny zagłówek H1.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default ShowSettings;
