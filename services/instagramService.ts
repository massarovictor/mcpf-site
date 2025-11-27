import { INSTAGRAM_TOKEN } from '../constants';

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
}

interface InstagramPost {
  imageUrl: string;
  postUrl: string;
}

const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return /\.(mp4|mov|avi|webm|m4v)(\?|$)/i.test(url);
};

export const getInstagramPosts = async (): Promise<InstagramPost[]> => {
  const token = INSTAGRAM_TOKEN as string;
  
  if (!token || token.includes('COLE_AQUI') || token.trim() === '') {
    console.log('Instagram token not configured.');
    return [];
  }

  try {
    const fields = 'id,media_type,media_url,thumbnail_url,permalink';
    const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}&limit=20`; 
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Instagram API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data || !data.data) {
        return [];
    }

    const posts = data.data
      .map((item: InstagramMedia) => {
        let imageUrl: string | null = null;

        // Determinar a URL da imagem
        if (item.thumbnail_url && !isVideoUrl(item.thumbnail_url)) {
          imageUrl = item.thumbnail_url;
        } else if (item.media_type === 'VIDEO') {
          return null; // Pula vídeos sem thumbnail válida
        } else if (item.media_url && !isVideoUrl(item.media_url)) {
          imageUrl = item.media_url;
        }

        // Se não temos imagem válida ou permalink, descarta
        if (!imageUrl || !item.permalink) {
          return null;
        }

        return {
          imageUrl,
          postUrl: item.permalink
        };
      })
      .filter((post: InstagramPost | null) => post !== null)
      .slice(0, 4);

    console.log(`Instagram: Loaded ${posts.length} valid posts`);
    return posts as InstagramPost[];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
};
