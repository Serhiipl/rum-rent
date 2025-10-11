import AllProducts from "@/components/all-products";
import HeroCarousel from "@/components/banners-component";
import Container from "@/components/container";
export const runtime = "nodejs";
export const revalidate = 60; // revalidate categories every 60s

export default async function Home() {
  return (
    <main className="flex flex-col items-center bg-stone-700 justify-items-center min-h-screen mt-16 p-2 sm:p-6 lg:p-8 w-full">
      <Container className="text-center  p-6 rounded-md">
        <h1 className="text-2xl sm:text-3xl font-semibold text-amber-600">
          Wypożyczalnia sprzętu RumRent — Pomorze
        </h1>
        <p className="mt-2 text-amber-400 max-w-2xl">
          Narzędzia i sprzęt gotowe do wynajmu. Szybki kontakt, dostępność,
          przejrzyste ceny.
        </p>
      </Container>
      <HeroCarousel />
      <AllProducts />
    </main>
  );
}
