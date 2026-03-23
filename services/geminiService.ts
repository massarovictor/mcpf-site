export const generateStudyAssistantResponse = async (userMessage: string): Promise<string> => {
  const message = userMessage.trim();
  if (!message) {
    return 'Digite uma mensagem para continuar.';
  }

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      return 'O assistente está indisponível no momento. Tente novamente.';
    }

    const data = (await response.json()) as { text?: string };
    return data.text?.trim() || 'Desculpe, não consegui processar sua solicitação no momento.';
  } catch (error) {
    console.error('Error calling Gemini API route:', error);
    return 'Houve um erro de comunicação com o sistema da escola. Tente novamente.';
  }
};
