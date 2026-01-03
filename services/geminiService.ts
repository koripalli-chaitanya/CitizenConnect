
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, Project } from "../types";

// Always use a named parameter and obtain the API key exclusively from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function vetProject(project: Project): Promise<AIAnalysisResult | null> {
  try {
    const prompt = `
      Analyze the following government project in India for authenticity and feasibility:
      Title: ${project.title}
      Location: ${project.location}
      Budget: ₹${project.budget}
      Contractor: ${project.contractor.name}
      Status: ${project.status}
      Deadline: ${project.deadline}
      
      Tasks:
      1. Use Google Search to find recent media reports about the contractor "${project.contractor.name}".
      2. Vet the deliverables: Is a budget of ₹${project.budget} reasonable for this type of project in ${project.location}?
      3. Timeline feasibility: Is the deadline of ${project.deadline} realistic?
      4. List any red flags or suggestions.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            costVetting: { type: Type.STRING },
            contractorBackground: { type: Type.STRING },
            timelineFeasibility: { type: Type.STRING },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceScore: { type: Type.NUMBER },
          },
          required: ["costVetting", "contractorBackground", "timelineFeasibility", "redFlags", "suggestions", "confidenceScore"],
        },
        tools: [{ googleSearch: {} }]
      },
    });

    // Extract grounding URLs as per guidelines for Google Search tool.
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Search Result',
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];

    const result = JSON.parse(response.text || '{}');
    return { ...result, sources } as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini Vetting Error:", error);
    return null;
  }
}

export async function crawlPublicProjects(location: string): Promise<any[]> {
  try {
    const prompt = `
      Act as a public procurement data crawler. Search for 3 recent or ongoing major government projects in ${location}, India.
      Focus on public domain data, tender notices, or news reports from the last 12 months.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              budget: { type: Type.NUMBER },
              contractorName: { type: Type.STRING },
              status: { type: Type.STRING },
              deadline: { type: Type.STRING },
            },
            required: ["title", "description", "budget", "contractorName", "status", "deadline"],
          }
        },
        tools: [{ googleSearch: {} }]
      },
    });

    const results = JSON.parse(response.text || '[]');
    return results;
  } catch (error) {
    console.error("Crawl Error:", error);
    return [];
  }
}
