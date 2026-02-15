import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostData } from "@/lib/local-content";
import UpdateDetailContent from "@/components/UpdateDetailContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UpdateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostData(id);

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Button asChild className="mt-4">
            <Link href="/updates">Back to Updates</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <UpdateDetailContent post={post} />
      <Footer />
    </main>
  );
}
