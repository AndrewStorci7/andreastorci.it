import Header from "@components/Header";
import LoadingOverlay from "@/components/inc/animated/Loader";
import HeroSection from "@components/Hero";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <LoadingOverlay />
      <Header />
      <HeroSection />
    </div>
  );
}
