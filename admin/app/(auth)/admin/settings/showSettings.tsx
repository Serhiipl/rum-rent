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
  const { settings, fetchSettings, settingsFetched, isFetchingSettings } =
    useServiceStore();

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
    <div className="py-6 bg-stone-600 rounded-md mx-auto w-full px-2">
      <p className="border border-amber-600 p-2 text-center rounded-md mb-4 bg-amber-50 text-amber-900">
        Tu wyswietlane są aktualne ustawienia Aplikacji
      </p>
      <Accordion type="single" collapsible className="w-full px-2">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <p className="flex gap-3 no-underline">
              <span className="font-semibold">Nazwa firmy: </span>
              {settings.company_name}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex w-full px-2 text-balance">
            <p>Nazwa firmy ktora będzie wyświetlana na stronie internetowej.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <p className="flex gap-3 no-underline">
              <span className="font-semibold">Dane właściciela: </span>
              {settings.owner_name}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex w-full px-2 text-balance">
            <p>
              Imie i nazwisko właściciela ktore będą wyświetlane jako dane
              kontaktowe na stronie internetowej.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <p className="flex gap-3 no-underline">
              <span className="font-semibold">Adres siedziby:</span>
              {settings.company_address}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Adres firmy lub miejsce prowadzenia działalności, które będą
              wyświetlane jako dane kontaktowe na stronie internetowej.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            <p className="flex gap-3 no-underline">
              <span className="font-semibold">Telefon firmy:</span>
              {settings.company_phone}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Numer telefonu firmy lub właściciela, który będzie wyświetlany
              jako telefon kontaktowy na stronie internetowej.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            <p className="flex gap-3 no-underline">
              <span className="font-semibold">NIP firmy:</span>
              {settings.company_nip}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Numer identyfikacji podatkowej (NIP) firmy, który może być
              wymagany do celów fakturowania i rozliczeń podatkowych.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            <p className="flex gap-3 no-underline">
              <span className="font-semibold">Email ustawień smtp:</span>
              {settings.smtp_user_emailFrom}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Adres email używany do wysyłania wiadomości e-mail z aplikacji za
              pomocą protokołu SMTP. Dodatkowo może być używany jako adres
              nadawcy w wysyłanych wiadomościach e-mail. Hasło do tego adresu
              email jest przechowywane w ustawieniach SMTP w pliku ENV
              aplikacji. <b>Nie może być taki sam jak email odbiorcy.</b>
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>
            <p className="flex gap-3 no-underline">
              <span className="font-semibold">Email odbiorcy:</span>
              {settings.email_receiver}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Adres email odbiorcy na który lecą wiadomości wysyłane z
              formularza kontaktowego na stronie internetowej.{" "}
              <b>Nie może być taki sam jak Email ustawień smtp!</b>
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>
            <p className="flex gap-3 no-underline">
              <span className="font-semibold">Nagłówek H1:</span>
              {settings.h1_title}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Nagłówek H1 jest potrzebny, aby nadać stronie główny tytuł, który
              jest kluczowy dla struktury strony, zrozumienia przez użytkowników
              i pozycjonowania w wyszukiwarkach (SEO). Jest to najważniejszy
              nagłówek, który informuje zarówno czytelników, jak i roboty
              wyszukiwarek, o czym jest dana strona, co pomaga w jej trafności w
              wynikach wyszukiwania
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger>
            <p className="flex gap-3 no-underline">
              <span className="font-semibold">Motto:</span>
              {settings.motto_description}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Krótkie hasło lub motto firmy, które może być dodatkowo
              wyświetlane na stronie internetowej.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default ShowSettings;
