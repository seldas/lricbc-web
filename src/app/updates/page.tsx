import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSortedPostsData } from "@/lib/local-content";
import UpdatesList from "@/components/UpdatesList";

export const dynamic = 'force-dynamic';

export default function UpdatesPage() {
  const posts = getSortedPostsData();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <UpdatesList initialPosts={posts} />
      <Footer />
    </main>
  );
}
