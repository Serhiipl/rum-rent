import AllProducts from "@/components/all-products";
import HeroCarousel from "@/components/banners-component";
import Container from "@/components/container";
export const runtime = "nodejs";
export const revalidate = 60; // revalidate categories every 60s

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-items-center min-h-screen mt-15 p-2 sm:p-20">
      <Container>
        <h1>Hello World</h1>
      </Container>
      <HeroCarousel />
      <AllProducts />
    </main>
  );
}
