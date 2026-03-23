export interface InstagramPost {
  imageUrl: string;
  postUrl: string;
}

export const getInstagramPosts = async (): Promise<InstagramPost[]> => {
  try {
    const response = await fetch('/api/instagram', {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Instagram sync error: ${response.status}`);
      return [];
    }

    const data = (await response.json()) as { posts?: InstagramPost[] };
    return Array.isArray(data.posts) ? data.posts : [];
  } catch (error) {
    console.error('Error fetching synced Instagram posts:', error);
    return [];
  }
};
