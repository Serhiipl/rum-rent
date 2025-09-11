import Container from "@/components/container";
export const runtime = "nodejs";
export const revalidate = 60; // revalidate categories every 60s

export default async function Home() {
  return (
    <main className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Container>
        <h1>Hello World</h1>
      </Container>
    </main>
  );
}
