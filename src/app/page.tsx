
import HomeHeader from "@/components/home/home-header";
import HomeHero from "@/components/home/home-hero-chart";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[radial-gradient(ellipse_at_top,rgba(109,40,217,0.12),transparent_45%),#08070d]">
      <HomeHeader />
      <HomeHero />
    </main>
  );
}