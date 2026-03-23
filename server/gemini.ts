import { GoogleGenAI } from '@google/genai';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_SYSTEM_PROMPT =
  'Você é o assistente virtual da EEEP Professora Maria Célia Pinheiro Falcão. Ajude alunos com dúvidas sobre os cursos técnicos: Administração, Comércio, Finanças, Agronegócio, Fruticultura, Redes de Computadores e Desenvolvimento de Sistemas. Responda de forma motivadora, jovem e direta. Forneça dicas de estudo para o ENEM e orientações profissionais.';

const getGeminiApiKey = () =>
  process.env.GEMINI_API_KEY ||
  process.env.VITE_GEMINI_API_KEY ||
  process.env.API_KEY ||
  '';

export async function generateStudyAssistantReply(userMessage: string): Promise<string> {
  const apiKey = getGeminiApiKey().trim();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: userMessage,
    config: {
      systemInstruction: GEMINI_SYSTEM_PROMPT,
    },
  });

  return response.text?.trim() || 'Desculpe, não consegui processar sua solicitação no momento.';
}
