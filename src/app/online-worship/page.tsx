import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLatestVideos, getLiveStreamId } from "@/lib/youtube";
import OnlineWorshipClient from "@/components/OnlineWorshipClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OnlineWorshipPage() {
  const channelId = "UCefUbMKSUD_2YGB3tWLwsAw";
  
  // Fetch latest videos and live status
  const [videos, liveVideoId] = await Promise.all([
    getLatestVideos(channelId, 10),
    getLiveStreamId(channelId)
  ]);
  
  const latestVideoId = liveVideoId ?? (videos.length > 0 ? videos[0].id : null);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <OnlineWorshipClient 
        key={liveVideoId ?? latestVideoId ?? channelId}
        channelId={channelId} 
        latestVideoId={latestVideoId} 
        liveVideoId={liveVideoId}
        initialVideos={videos}
      />
      <Footer />
    </main>
  );
}
