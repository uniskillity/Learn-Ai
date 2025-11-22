import { GoogleGenAI, Type } from "@google/genai";
import { LearningPath, ResourceItem, Difficulty, ResourceType, TopicNode, ModuleContent } from "../types";

// Initialize API Client
const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

// --- Mock Data Generators ---
// These ensure the app remains functional and interactive even if the API is unavailable.

const getMockTopic = (name: string): TopicNode => ({
    name: name,
    description: `(Offline Preview) ${name} is a significant field in modern technology. This content is a placeholder generated because the live AI service is currently unavailable. It typically involves studying algorithms, data patterns, and computational models to solve complex problems.`,
    subtopics: ['Fundamental Concepts', 'Key Algorithms', 'Real-world Applications', 'Ethical Considerations', 'Future Trends'],
    relatedFields: ['Computer Science', 'Data Science', 'Mathematics', 'Statistics']
});

const getMockLearningPath = (topic: string, difficulty: Difficulty): LearningPath => ({
    id: `mock-path-${Date.now()}`,
    topic: topic,
    difficulty: difficulty,
    modules: [
        {
            title: `Introduction to ${topic}`,
            description: "An overview of core concepts and terminology.",
            topics: ["Basics", "History", "Key Terms"],
            estimatedHours: 2,
            status: 'active'
        },
        {
            title: "Core Principles",
            description: "Deep dive into the fundamental theories.",
            topics: ["Theory", "Methodology"],
            estimatedHours: 4,
            status: 'locked'
        },
        {
            title: "Practical Applications",
            description: "Applying knowledge to real-world scenarios.",
            topics: ["Case Studies", "Implementation"],
            estimatedHours: 5,
            status: 'locked'
        }
    ]
});

const getMockModuleContent = (title: string): ModuleContent => ({
    overview: `This is a placeholder overview for "${title}". The AI service is currently offline, but you can still interact with the lesson structure. In a live environment, this would contain a detailed tutorial customized to your learning path.`,
    sections: [
        {
            title: "Key Concepts",
            content: "This section would normally explain the fundamental concepts in detail. \n\nIt would cover definitions, examples, and theoretical underpinnings necessary for understanding the topic."
        },
        {
            title: "Practical Implementation",
            content: "Here you would find step-by-step instructions on how to apply these concepts. \n\nThis might include best practices, common pitfalls, and workflow strategies."
        }
    ],
    codeExample: {
        language: "python",
        code: "def demo_function():\n    # This is a placeholder code example\n    print('Learning AI is fun!')\n    return True",
        explanation: "This simple function demonstrates the syntax relevant to the topic."
    },
    quiz: {
        question: "What is the primary purpose of this placeholder content?",
        options: [
            "To teach advanced AI",
            "To demonstrate UI functionality when offline",
            "To solve world hunger",
            "None of the above"
        ],
        correctAnswer: 1,
        explanation: "This content ensures the application remains usable even without a live API connection."
    }
});

const getMockResources = (category: string): ResourceItem[] => [
    {
        id: `mock-res-1-${Date.now()}`,
        title: `Fundamentals of ${category}`,
        author: 'Jane Doe',
        type: ResourceType.Book,
        url: '#',
        description: 'A comprehensive guide to getting started with clear examples and exercises.',
        tags: ['Beginner', 'Theory']
    },
    {
        id: `mock-res-2-${Date.now()}`,
        title: `${category} in Practice`,
        author: 'John Smith',
        type: ResourceType.Course,
        url: '#',
        description: 'Hands-on tutorials and projects designed to build real-world skills.',
        tags: ['Practical', 'Coding']
    },
    {
        id: `mock-res-3-${Date.now()}`,
        title: `Advanced ${category} Toolkit`,
        author: 'Tech Corp',
        type: ResourceType.Tool,
        url: '#',
        description: 'Essential tools and libraries for professional development.',
        tags: ['Tools', 'Professional']
    }
];

// --- API Functions ---

export const generateLearningPath = async (topic: string, difficulty: Difficulty): Promise<LearningPath | null> => {
  const ai = getClient();
  if (!ai) {
      console.warn("API Key missing, using mock data for Learning Path");
      await new Promise(r => setTimeout(r, 1000)); // Simulate network delay
      return getMockLearningPath(topic, difficulty);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a detailed learning path for "${topic}" at a "${difficulty}" level.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  estimatedHours: { type: Type.NUMBER }
                },
                required: ["title", "description", "topics", "estimatedHours"]
              }
            }
          },
          required: ["id", "topic", "difficulty", "modules"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as LearningPath;
  } catch (error) {
    console.error("Error generating learning path:", error);
    return getMockLearningPath(topic, difficulty);
  }
};

export const generateModuleContent = async (topic: string, moduleTitle: string, difficulty: string): Promise<ModuleContent | null> => {
  const ai = getClient();
  if (!ai) {
      await new Promise(r => setTimeout(r, 1000));
      return getMockModuleContent(moduleTitle);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a concise, high-quality tutorial for the module "${moduleTitle}" which is part of the course "${topic}" (${difficulty} level).
      
      Include:
      1. A clear, brief overview.
      2. 2 focused sections explaining core concepts.
      3. A short, relevant code example (Python preferred).
      4. A single quiz question.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            },
            codeExample: {
              type: Type.OBJECT,
              properties: {
                language: { type: Type.STRING },
                code: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["language", "code", "explanation"]
            },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-based)" },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          },
          required: ["overview", "sections", "codeExample", "quiz"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as ModuleContent;
  } catch (error) {
    console.error("Error generating module content:", error);
    return getMockModuleContent(moduleTitle);
  }
};

export const generateResources = async (category: string): Promise<ResourceItem[]> => {
  const ai = getClient();
  if (!ai) {
      await new Promise(r => setTimeout(r, 1000));
      return getMockResources(category);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Recommend 5 high-quality AI resources (books, papers, tools, or courses) for: "${category}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              type: { type: Type.STRING, enum: [ResourceType.Book, ResourceType.Course, ResourceType.Paper, ResourceType.Tool] },
              url: { type: Type.STRING },
              description: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "author", "type", "url", "description", "tags"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as ResourceItem[];
  } catch (error) {
    console.error("Error generating resources:", error);
    return getMockResources(category);
  }
};

export const generateTopicOverview = async (topicName: string): Promise<TopicNode | null> => {
  const ai = getClient();
  if (!ai) {
      console.warn("API Key missing, using mock data for Topic Explorer");
      await new Promise(r => setTimeout(r, 800)); // Simulate delay
      return getMockTopic(topicName);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the AI topic '${topicName}'. Provide a concise description, a list of key subtopics or sub-disciplines, and related fields.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            subtopics: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            relatedFields: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "description", "subtopics", "relatedFields"]
        }
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as TopicNode;
  } catch (error) {
    console.error("Error exploring topic:", error);
    return getMockTopic(topicName);
  }
};