import { generateStudyAssistantReply } from '../server/gemini';

interface RequestLike {
  method?: string;
  body?: { message?: string } | string;
}

interface ResponseLike {
  status: (code: number) => {
    json: (body: unknown) => void;
  };
}

const getMessage = (body: RequestLike['body']): string => {
  if (!body) return '';
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body) as { message?: string };
      return typeof parsed.message === 'string' ? parsed.message.trim() : '';
    } catch {
      return '';
    }
  }

  return typeof body.message === 'string' ? body.message.trim() : '';
};

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const message = getMessage(req.body);
  if (!message) {
    res.status(400).json({ error: 'Mensagem inválida.' });
    return;
  }

  try {
    const text = await generateStudyAssistantReply(message);
    res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini API route failed:', error);
    res.status(500).json({ error: 'Falha ao consultar o assistente.' });
  }
}
