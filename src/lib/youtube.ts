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
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const browserHeader = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  };

  try {
    // Strategy 1: Attempt RSS Feed
    const response = await fetch(rssUrl, {
      cache: 'no-store',
      headers: browserHeader
    });
    
    if (response.ok) {
      const text = await response.text();
      const entries = text.split('<entry>');
      const videos: YouTubeVideo[] = [];
      
      for (let i = 1; i < entries.length && videos.length < limit; i++) {
        const entry = entries[i];
        const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
        
        if (idMatch && titleMatch) {
          videos.push({
            id: idMatch[1],
            title: titleMatch[1],
            published: publishedMatch ? publishedMatch[1] : '',
            thumbnail: `https://i.ytimg.com/vi/${idMatch[1]}/hqdefault.jpg`
          });
        }
      }
      
      if (videos.length > 0) return videos;
    }
    
    console.warn(`YouTube RSS failed or empty for ${channelId}, trying Strategy 2 (HTML Scraping)...`);

    // Strategy 2: Fallback to scraping the Channel Videos page
    const channelUrl = `https://www.youtube.com/channel/${channelId}/videos`;
    const htmlResponse = await fetch(channelUrl, {
      cache: 'no-store',
      headers: browserHeader
    });

    if (htmlResponse.ok) {
      const html = await htmlResponse.text();
      const videos: YouTubeVideo[] = [];
      
      // Look for the JSON object containing video data in the HTML
      const jsonMatch = html.match(/var ytInitialData = (\{.*?\});/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          // Path: contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents
          const contents = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[1]?.tabRenderer?.content?.richGridRenderer?.contents;
          
          if (contents && Array.isArray(contents)) {
            for (const item of contents) {
              const videoData = item.richItemRenderer?.content?.videoRenderer;
              if (videoData && videoData.videoId) {
                videos.push({
                  id: videoData.videoId,
                  title: videoData.title?.runs?.[0]?.text || 'Untitled',
                  published: videoData.publishedTimeText?.simpleText || '',
                  thumbnail: `https://i.ytimg.com/vi/${videoData.videoId}/hqdefault.jpg`
                });
                if (videos.length >= limit) break;
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse ytInitialData for fallback scraping", e);
        }
      }
      
      if (videos.length > 0) return videos;
    }

    return [];
  } catch (error) {
    console.error("All YouTube fetch strategies failed:", error);
    return [];
  }
}
