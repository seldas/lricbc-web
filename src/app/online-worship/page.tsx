import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLatestVideos } from "@/lib/youtube";
import OnlineWorshipClient from "@/components/OnlineWorshipClient";

export default async function OnlineWorshipPage() {
  const channelId = "UCefUbMKSUD_2YGB3tWLwsAw";
  
  // Fetch latest videos
  const videos = await getLatestVideos(channelId, 10);
  
  const latestVideoId = videos.length > 0 ? videos[0].id : null;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <OnlineWorshipClient 
        channelId={channelId} 
        latestVideoId={latestVideoId} 
        initialVideos={videos}
      />
      <Footer />
    </main>
  );
}
