import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  try {
    // Safety check for process.env access
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
    
    if (!apiKey) {
      console.warn("API Key is missing or process.env is unavailable");
      return null;
    }
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Error initializing AI client:", e);
    return null;
  }
};

export const generateStudyAssistantResponse = async (userMessage: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Erro: Chave de API não configurada ou erro de inicialização. Por favor, verifique a configuração.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: "Você é o assistente virtual da EEEP Professora Maria Célia Pinheiro Falcão. Ajude alunos com dúvidas sobre os cursos técnicos: Administração, Comércio, Finanças, Agronegócio, Fruticultura, Redes de Computadores e Desenvolvimento de Sistemas. Responda de forma motivadora, jovem e direta. Forneça dicas de estudo para o ENEM e orientações profissionais.",
      }
    });

    return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Houve um erro de comunicação com o sistema da escola. Tente novamente.";
  }
};