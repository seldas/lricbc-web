import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DevotionReadings from "@/components/DevotionReadings";

export const dynamic = 'force-dynamic';

export default function DevotionPage() {
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <DevotionReadings initialDate={todayIso} />
      <Footer />
    </main>
  );
}
