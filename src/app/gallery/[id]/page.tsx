import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGalleryEvent } from "@/lib/local-gallery";
import GalleryDetailView from "@/components/GalleryDetailView";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function GalleryEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getGalleryEvent(id);

  if (!event) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-light text-sky-900">Gallery Not Found</h1>
          <Button asChild className="mt-8 rounded-full px-8 py-6">
            <Link href="/gallery">Back to Gallery</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  // Redirect to Google Photos if link is available
  if (event.googlePhotosUrl) {
    redirect(event.googlePhotosUrl);
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <GalleryDetailView event={event} />
      <Footer />
    </main>
  );
}
