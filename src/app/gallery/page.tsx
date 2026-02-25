import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGalleryEvents } from "@/lib/local-gallery";
import GalleryList from "@/components/GalleryList";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const events = await getGalleryEvents();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <GalleryList initialEvents={events} />
      <Footer />
    </main>
  );
}
