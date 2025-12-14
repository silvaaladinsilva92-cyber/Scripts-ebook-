import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing via process.env.API_KEY");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Generate questions based on social psychology and conversation dynamics
export const generateQuestions = async (): Promise<Question[]> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Você é um especialista em psicologia social, carisma e dinâmica de conversas.
      Crie um quiz de 5 perguntas desafiadoras em Português (Brasil).
      
      O tema é: "Transformar conversas chatas em encontros sem esforço usando psicologia aplicada".
      
      Cada pergunta deve apresentar um **cenário prático** de interação social ou encontro, e pedir a melhor resposta baseada em inteligência social e atração.
      Evite clichês baratos. Foque em:
      1. Leitura de linguagem corporal.
      2. Quebra de gelo criativa.
      3. Escuta ativa e validação emocional.
      4. Criar tensão positiva.

      Retorne APENAS um JSON array.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              scenario: { type: Type.STRING, description: "A situação social ou pergunta" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "4 opções de resposta" 
              },
              correctOptionIndex: { type: Type.INTEGER, description: "Índice (0-3) da melhor resposta" },
              explanation: { type: Type.STRING, description: "Por que essa é a melhor resposta psicologicamente" }
            },
            required: ["id", "scenario", "options", "correctOptionIndex", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Question[];
    }
    throw new Error("Resposta vazia do Gemini");

  } catch (error) {
    console.error("Erro ao gerar perguntas:", error);
    throw error;
  }
};

// Analyze the user's performance
export const analyzePerformance = async (score: number, total: number): Promise<QuizResult> => {
  try {
    const model = 'gemini-2.5-flash';
    const percentage = (score / total) * 100;

    const prompt = `
      O usuário completou um quiz sobre "Sedução e Conversa Inteligente".
      Acertou ${score} de ${total} (${percentage}%).

      Gere um feedback curto e um arquétipo de personalidade.
      Use o tom de um mentor sofisticado.

      Retorne JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            totalQuestions: { type: Type.INTEGER },
            feedback: { type: Type.STRING, description: "2 parágrafos de análise" },
            archetype: { type: Type.STRING, description: "Um título legal, ex: 'Mestre do Carisma' ou 'Aprendiz Atento'" }
          },
          required: ["score", "totalQuestions", "feedback", "archetype"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure specific fields match our internal logic just in case, though schema handles it
      return {
        score: score,
        totalQuestions: total,
        feedback: data.feedback,
        archetype: data.archetype
      };
    }
    throw new Error("Resposta de análise vazia");

  } catch (error) {
    console.error("Erro ao analisar resultados:", error);
    return {
      score,
      totalQuestions: total,
      feedback: "Houve um erro ao conectar com o mentor de IA. Mas com base na sua pontuação, continue praticando!",
      archetype: "Desconhecido"
    };
  }
};
