"use client";

import Container from "@/components/container";
import Link from "next/link";

const email = process.env.COMPANY_EMAIL || "biuro.rumrent@gmail.com";

const address =
  process.env.COMPANY_ADDRESS || "ul. Przykładowa 1, 00-001 Gdynia";
const companyNIP = process.env.OWNER_NIP || "123-456-78-90";

export default function PrivacyPolicyPage() {
  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="container mt-20 py-10 mx-auto px-4 bg-stone-700 text-stone-200 rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl text-center font-bold">
          Polityka Prywatności
        </h1>
        <p className="mb-4 text-center">
          Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony
          danych osobowych użytkowników korzystających z serwisu RumRent
          (zwanego dalej Serwisem). Serwis jest prowadzony przez RumRent, z
          siedzibą w {address}.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">1. Administrator Danych</h2>
        <p className="mb-4">
          Administratorem danych osobowych jest RumRent, z siedzibą w {address},
          NIP: {companyNIP}. Kontakt z administratorem jest możliwy pod adresem
          email: <Link href={`mailto:${email}`}>{email}</Link>.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">2. Zakres Danych</h2>
        <p className="mb-4">
          Serwis może zbierać następujące dane osobowe użytkowników:
        </p>
        <ul className="mb-4 list-disc list-inside">
          <li>Imię i nazwisko</li>
          <li>Adres email</li>
          <li>Numer telefonu</li>
          <li>Dane techniczne (np. adres IP, typ przeglądarki)</li>
        </ul>
        <h2 className="mb-4 text-2xl font-semibold">
          3. Cel Przetwarzania Danych
        </h2>
        <p className="mb-4">
          Dane osobowe użytkowników są przetwarzane w następujących celach:
        </p>
        <ul className="mb-4 list-disc list-inside">
          <li>Realizacja usług oferowanych przez Serwis</li>
          <li>Kontakt z użytkownikami w sprawach związanych z Serwisem</li>
          <li>Marketing bezpośredni własnych produktów i usług</li>
          <li>Analiza i poprawa funkcjonowania Serwisu</li>
        </ul>
        <h2 className="mb-4 text-2xl font-semibold">
          4. Podstawa Prawna Przetwarzania
        </h2>
        <p className="mb-4">
          Przetwarzanie danych osobowych odbywa się na podstawie:
        </p>
        <ul className="mb-4 list-disc list-inside">
          <li>Zgody użytkownika (art. 6 ust. 1 lit. a RODO)</li>
          <li>Niezbędności do wykonania umowy (art. 6 ust. 1 lit. b RODO)</li>
          <li>Wypełnienia obowiązku prawnego (art. 6 ust. 1 lit. c RODO)</li>
          <li>
            Uzasadnionych interesów realizowanych przez administratora (art. 6
            ust. 1 lit. f RODO)
          </li>
        </ul>
        <h2 className="mb-4 text-2xl font-semibold">
          5. Okres Przechowywania Danych
        </h2>
        <p className="mb-4">
          Dane osobowe będą przechowywane przez okres niezbędny do realizacji
          celów, dla których zostały zebrane, a także przez okres wymagany
          przepisami prawa.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">6. Prawa Użytkowników</h2>
        <p className="mb-4">Użytkownicy mają prawo do:</p>
        <ul className="mb-4 list-disc list-inside">
          <li>Dostępu do swoich danych osobowych</li>
          <li>Sprostowania nieprawidłowych danych</li>
          <li>Usunięcia danych (prawo do bycia zapomnianym)</li>
          <li>Ograniczenia przetwarzania danych</li>
          <li>Przenoszenia danych</li>
          <li>Wniesienia sprzeciwu wobec przetwarzania danych</li>
          <li>Wycofania zgody na przetwarzanie danych w dowolnym momencie</li>
        </ul>
        <h2 className="mb-4 text-2xl font-semibold">7. Pliki Cookies</h2>
        <p className="mb-4">
          Serwis korzysta z plików cookies w celu poprawy funkcjonalności i
          komfortu użytkowania. Użytkownicy mogą zarządzać ustawieniami cookies
          poprzez ustawienia swojej przeglądarki.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">
          8. Zmiany w Polityce Prywatności
        </h2>
        <p className="mb-4">
          Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce
          Prywatności. Zmiany będą publikowane na tej stronie z odpowiednim
          wyprzedzeniem.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">9. Kontakt</h2>
        <p className="mb-4">
          W przypadku pytań dotyczących Polityki Prywatności prosimy o kontakt
          pod adresem email: <Link href={`mailto:${email}`}>{email}</Link>
        </p>
      </div>
    </Container>
  );
}
