import AllProducts from "@/components/all-products";
import HeroCarousel from "@/components/banners-component";
import Container from "@/components/container";
import H1 from "@/components/h1";
import Motto from "@/components/motto";

export const runtime = "nodejs";
export const revalidate = 20; // revalidate categories every 20s

export default async function Home() {
  return (
    <main className="flex flex-col items-center bg-stone-700 justify-items-center min-h-screen  p-2 sm:p-6 lg:p-8 w-full">
      <Container className="text-center pt-19 pb-6 rounded-md">
        {/* <h1 className="text-2xl sm:text-3xl font-semibold text-amber-600">
          {h1Title}
        </h1> */}
        <H1 />
        <Motto />
      </Container>
      <HeroCarousel />
      <AllProducts />
    </main>
  );
}
