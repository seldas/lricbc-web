export interface YouTubeVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
}

/**
 * Checks if a channel is currently live and returns the video ID if it is.
 * Uses a fetch to the live URL and parses the response for live indicators.
 */
export async function getLiveStreamId(channelId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://www.youtube.com/channel/${channelId}/live`, {
      // Disable cache to get real-time status
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // Check for live indicators in the HTML
    // YouTube embeds "isLive":true in the ytInitialPlayerResponse or ytInitialData
    if (html.includes('"isLive":true') || html.includes('\"isLive\":true')) {
      // Extract video ID from the canonical URL or ytInitialData
      const videoIdMatch = html.match(/\"videoId\":\"([^\"]+)\"/);
      if (videoIdMatch) {
        return videoIdMatch[1];
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error checking live status:", error);
    return null;
  }
}

export async function getLatestVideoId(channelId: string): Promise<string | null> {
  const videos = await getLatestVideos(channelId, 1);
  return videos.length > 0 ? videos[0].id : null;
}

export async function getLatestVideos(channelId: string, limit: number = 20): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const text = await response.text();
    
    // Improved parsing for multiple videos
    const entries = text.split('<entry>');
    const videos: YouTubeVideo[] = [];
    
    // Skip the first part which is channel info
    for (let i = 1; i < entries.length && videos.length < limit; i++) {
      const entry = entries[i];
      
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const thumbnailMatch = entry.match(/url="([^"]+)"/); // Simplification for media:thumbnail
      
      if (idMatch && titleMatch) {
        videos.push({
          id: idMatch[1],
          title: titleMatch[1],
          published: publishedMatch ? publishedMatch[1] : '',
          thumbnail: thumbnailMatch ? thumbnailMatch[1] : `https://i.ytimg.com/vi/${idMatch[1]}/hqdefault.jpg`
        });
      }
    }
    
    return videos;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}
