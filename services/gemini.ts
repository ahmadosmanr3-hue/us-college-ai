
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, QuizQuestion, StudySession } from "../types";

// Initialize using the environment variable directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const studySessionSchema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["id", "question", "answer", "category"],
      },
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctAnswer: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ["id", "question", "options", "correctAnswer", "explanation"],
      },
    },
  },
  required: ["topic", "flashcards", "quiz"],
};

export const generateStudyContent = async (pdfBase64: string): Promise<StudySession> => {
  const model = 'gemini-3-flash-preview';

  const prompt = `Analyze the attached PDF and generate a complete study package.
    1. Identify the main topic.
    2. Create exactly 10 high-quality flashcards covering key definitions, concepts, and relationships.
    3. Create a 5-question multiple choice quiz. Each question must have exactly 4 options and one correct answer.
    Include detailed explanations for why the correct answer is right.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: studySessionSchema,
      },
    });

    const result = JSON.parse(response.text || '{}') as StudySession;
    return result;
  } catch (error) {
    console.error("Error generating study content:", error);
    throw new Error("Failed to process PDF. Please try again with a different file.");
  }
};

export const generateAppIcon = async (): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: "A simple and elegant app icon for 'US COLLEGE AI'. It features a clean, white stylized mortarboard (graduation cap) combined with a subtle, glowing circuit line. The background is a solid, premium navy blue. Modern flat design, high quality, professional and academic.",
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating app icon:", error);
    return null;
  }
};
