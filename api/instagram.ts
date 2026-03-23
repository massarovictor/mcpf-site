import { fetchInstagramPostsFromServer } from '../server/instagram';

export default async function handler(req: { method?: string }, res: { status: (code: number) => { json: (body: unknown) => void } }) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const posts = await fetchInstagramPostsFromServer();
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Instagram API route failed:', error);
    res.status(500).json({ error: 'Falha ao sincronizar Instagram.' });
  }
}
