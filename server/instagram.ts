import type { InstagramPost } from '../services/instagramService';

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
}

const INSTAGRAM_FIELDS = 'id,media_type,media_url,thumbnail_url,permalink';
const INSTAGRAM_LIMIT = 12;
const INSTAGRAM_MEDIA_URL = 'https://graph.instagram.com/me/media';
const INSTAGRAM_REFRESH_URL = 'https://graph.instagram.com/refresh_access_token';

const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return /\.(mp4|mov|avi|webm|m4v)(\?|$)/i.test(url);
};

const getInstagramAccessToken = () =>
  process.env.INSTAGRAM_ACCESS_TOKEN ||
  process.env.VITE_INSTAGRAM_ACCESS_TOKEN ||
  process.env.VITE_INSTAGRAM_TOKEN ||
  '';

interface InstagramApiErrorResponse {
  error?: {
    message?: string;
    code?: number;
    type?: string;
  };
}

interface InstagramApiSuccess<T> {
  ok: true;
  data: T;
}

interface InstagramApiFailure {
  ok: false;
  status: number;
  error: string;
  code?: number;
}

type InstagramApiResult<T> = InstagramApiSuccess<T> | InstagramApiFailure;

const buildInstagramMediaUrl = (token: string) =>
  `${INSTAGRAM_MEDIA_URL}?fields=${INSTAGRAM_FIELDS}&access_token=${encodeURIComponent(token)}&limit=${INSTAGRAM_LIMIT}`;

const fetchInstagramJson = async <T>(url: string): Promise<InstagramApiResult<T>> => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  const payload = (await response.json().catch(() => ({}))) as T & InstagramApiErrorResponse;

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: payload.error?.message || `Instagram API returned ${response.status}`,
      code: payload.error?.code,
    };
  }

  return { ok: true, data: payload as T };
};

const isInstagramApiFailure = <T>(
  result: InstagramApiResult<T>,
): result is InstagramApiFailure => result.ok === false;

const tryRefreshInstagramToken = async (token: string): Promise<string | null> => {
  const refreshUrl = `${INSTAGRAM_REFRESH_URL}?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`;
  const result = await fetchInstagramJson<{ access_token?: string }>(refreshUrl);
  if (!result.ok) {
    return null;
  }

  return typeof result.data.access_token === 'string' && result.data.access_token
    ? result.data.access_token
    : null;
};

const loadInstagramMedia = async (token: string) =>
  fetchInstagramJson<{ data?: InstagramMedia[] }>(buildInstagramMediaUrl(token));

export async function fetchInstagramPostsFromServer(): Promise<InstagramPost[]> {
  const token = getInstagramAccessToken().trim();
  if (!token) {
    return [];
  }

  let mediaResult = await loadInstagramMedia(token);
  if (isInstagramApiFailure(mediaResult)) {
    if (mediaResult.code === 190) {
      const refreshedToken = await tryRefreshInstagramToken(token);
      if (refreshedToken) {
        mediaResult = await loadInstagramMedia(refreshedToken);
      }
    }
  }

  if (!isInstagramApiFailure(mediaResult)) {
    const items = Array.isArray(mediaResult.data.data) ? mediaResult.data.data : [];

    return items
      .map((item) => {
        let imageUrl: string | null = null;

        if (item.thumbnail_url && !isVideoUrl(item.thumbnail_url)) {
          imageUrl = item.thumbnail_url;
        } else if (item.media_type === 'VIDEO') {
          return null;
        } else if (item.media_url && !isVideoUrl(item.media_url)) {
          imageUrl = item.media_url;
        }

        if (!imageUrl || !item.permalink) {
          return null;
        }

        return {
          imageUrl,
          postUrl: item.permalink,
        };
      })
      .filter((post): post is InstagramPost => Boolean(post))
      .slice(0, 4);
  }

  console.warn(`Instagram sync unavailable: ${mediaResult.error}`);
  return [];
}
