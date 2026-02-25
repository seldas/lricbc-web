import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLatestVideos, getLiveStreamId } from "@/lib/youtube";
import OnlineWorshipClient from "@/components/OnlineWorshipClient";

export default async function OnlineWorshipPage() {
  const channelId = "UCefUbMKSUD_2YGB3tWLwsAw";
  
  // Check for live stream and latest videos in parallel
  const [liveVideoId, videos] = await Promise.all([
    getLiveStreamId(channelId),
    getLatestVideos(channelId, 10)
  ]);
  
  const latestVideoId = videos.length > 0 ? videos[0].id : null;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <OnlineWorshipClient 
        channelId={channelId} 
        liveVideoId={liveVideoId}
        latestVideoId={latestVideoId} 
        initialVideos={videos}
      />
      <Footer />
    </main>
  );
}
