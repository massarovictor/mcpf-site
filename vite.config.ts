import path from 'path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { generateStudyAssistantReply } from './server/gemini';
import { fetchInstagramPostsFromServer } from './server/instagram';

const sendJson = (res: ServerResponse, status: number, payload: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const readJsonBody = async (req: IncomingMessage): Promise<Record<string, unknown>> => {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  if (!body) return {};

  try {
    return JSON.parse(body) as Record<string, unknown>;
  } catch {
    return {};
  }
};

const localApiPlugin = () => ({
  name: 'local-api-plugin',
  configureServer(server: { middlewares: { use: (handler: (req: IncomingMessage & { url?: string; method?: string }, res: ServerResponse, next: () => void) => void | Promise<void>) => void } }) {
    server.middlewares.use(async (req, res, next) => {
      const pathname = req.url?.split('?')[0];

      if (pathname === '/api/instagram' && req.method === 'GET') {
        try {
          const posts = await fetchInstagramPostsFromServer();
          sendJson(res, 200, { posts });
        } catch (error) {
          console.error('Local Instagram sync failed:', error);
          sendJson(res, 500, { error: 'Falha ao sincronizar Instagram.' });
        }
        return;
      }

      if (pathname === '/api/gemini' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const message = typeof body.message === 'string' ? body.message.trim() : '';

        if (!message) {
          sendJson(res, 400, { error: 'Mensagem inválida.' });
          return;
        }

        try {
          const text = await generateStudyAssistantReply(message);
          sendJson(res, 200, { text });
        } catch (error) {
          console.error('Local Gemini request failed:', error);
          sendJson(res, 500, { error: 'Falha ao consultar o assistente.' });
        }
        return;
      }

      next();
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), localApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
