
import { GoogleGenAI, Type } from "@google/genai";
import { LearningPath, ResourceItem, Difficulty, ResourceType, TopicNode, ModuleContent, AssignmentFeedback } from "../types";

// Initialize API Client
const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

// --- Mock Data Generators ---

const getMockTopic = (name: string): TopicNode => ({
    name: name,
    description: `(Offline Preview) ${name} is a significant field in modern technology. This content is a placeholder generated because the live AI service is currently unavailable. It typically involves studying algorithms, data patterns, and computational models to solve complex problems.`,
    subtopics: ['Fundamental Concepts', 'Key Algorithms', 'Real-world Applications', 'Ethical Considerations', 'Future Trends'],
    relatedFields: ['Computer Science', 'Data Science', 'Mathematics', 'Statistics']
});

const getMockLearningPath = (topic: string, difficulty: Difficulty, techStack?: string): LearningPath => ({
    id: `mock-path-${Date.now()}`,
    topic: topic,
    techStack: techStack || "General",
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
            title: "Core Principles & Architecture",
            description: "Deep dive into the fundamental theories.",
            topics: ["Theory", "Methodology"],
            estimatedHours: 4,
            status: 'locked'
        },
        {
            title: `Implementing with ${techStack || 'Code'}`,
            description: "Applying knowledge to real-world scenarios.",
            topics: ["Case Studies", "Implementation"],
            estimatedHours: 5,
            status: 'locked'
        }
    ]
});

const getMockModuleContent = (title: string, techStack?: string): ModuleContent => ({
    overview: `This is a placeholder overview for "${title}". The AI service is currently offline. In a live environment, this would contain a detailed tutorial customized to your learning path using ${techStack || 'standard libraries'}.`,
    sections: [
        {
            title: "Theoretical Foundation",
            content: "This section would normally explain the fundamental concepts in detail. \n\nIt would cover definitions, examples, and theoretical underpinnings necessary for understanding the topic."
        },
        {
            title: "Implementation Strategy",
            content: "Here you would find step-by-step instructions on how to apply these concepts. \n\nThis might include best practices, common pitfalls, and workflow strategies."
        }
    ],
    codeExample: {
        language: "python",
        code: `import ${techStack?.toLowerCase().replace(' ', '') || 'numpy'} as lib\n\ndef demo_model():\n    # Placeholder for ${techStack} code\n    data = lib.array([1, 2, 3])\n    print("Model initialized")\n    return data`,
        explanation: `This simple function demonstrates the syntax relevant to ${techStack || 'the topic'}.`
    },
    quizzes: [
        {
            question: "What is the primary purpose of this placeholder content?",
            options: [
                "To teach advanced AI",
                "To demonstrate UI functionality when offline",
                "To solve world hunger",
                "None of the above"
            ],
            correctAnswer: 1,
            explanation: "This content ensures the application remains usable even without a live API connection."
        },
        {
            question: "Which phase comes first in the learning process?",
            options: ["Implementation", "Theory", "Deployment", "Retirement"],
            correctAnswer: 1,
            explanation: "Understanding the theory is crucial before moving to implementation."
        },
        {
            question: "What is a key benefit of using frameworks?",
            options: ["They make code slower", "They require more boilerplate", "They provide pre-built abstractions", "They are illegal"],
            correctAnswer: 2,
            explanation: "Frameworks abstract away complex low-level details."
        }
    ],
    assignment: {
        title: "Hello World Project",
        description: `Create a basic script using ${techStack || 'Python'} that initializes a data structure and prints it.`,
        requirements: [
            "Install the necessary library",
            "Import the library",
            "Create a simple data array or tensor",
            "Print the shape of the data"
        ],
        difficulty: "Easy"
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

const getMockEvaluation = (): AssignmentFeedback => ({
    status: 'Pass',
    feedback: "Good job on the implementation! You've correctly set up the basic structure.",
    strengths: ["Correct syntax", "Logic follows requirements"],
    improvements: ["Consider adding error handling", "Add comments for clarity"]
});

// --- API Functions ---

export const generateLearningPath = async (topic: string, difficulty: Difficulty, techStack?: string): Promise<LearningPath | null> => {
  const ai = getClient();
  if (!ai) {
      console.warn("API Key missing, using mock data for Learning Path");
      await new Promise(r => setTimeout(r, 1000)); 
      return getMockLearningPath(topic, difficulty, techStack);
  }

  try {
    const prompt = `Create a detailed learning path for "${topic}" at a "${difficulty}" level. 
    ${techStack ? `Focus specifically on using the "${techStack}" technology/framework.` : ''}
    The modules should be sequential and build upon each other.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            techStack: { type: Type.STRING },
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
    
    const data = JSON.parse(text) as LearningPath;
    // Ensure techStack is preserved if model drops it
    if (techStack && !data.techStack) data.techStack = techStack;
    return data;

  } catch (error) {
    console.error("Error generating learning path:", error);
    return getMockLearningPath(topic, difficulty, techStack);
  }
};

export const generateModuleContent = async (topic: string, moduleTitle: string, difficulty: string, techStack?: string): Promise<ModuleContent | null> => {
  const ai = getClient();
  if (!ai) {
      await new Promise(r => setTimeout(r, 1000));
      return getMockModuleContent(moduleTitle, techStack);
  }

  try {
    const prompt = `Create a concise, high-quality tutorial for the module "${moduleTitle}" which is part of the course "${topic}" (${difficulty} level).
    
    Context:
    - Tech Stack: ${techStack || "General/Agnostic"}
    
    Requirements:
    1. A clear, brief overview.
    2. 2-3 focused sections explaining core concepts.
    3. A relevant code example (using ${techStack || 'Python'}).
    4. 3 Quiz questions to test understanding.
    5. A "Practical Assignment" challenge that asks the user to build something small based on this module.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
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
            quizzes: {
              type: Type.ARRAY,
              items: {
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
            assignment: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                    difficulty: { type: Type.STRING }
                },
                required: ["title", "description", "requirements", "difficulty"]
            }
          },
          required: ["overview", "sections", "codeExample", "quizzes", "assignment"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as ModuleContent;
  } catch (error) {
    console.error("Error generating module content:", error);
    return getMockModuleContent(moduleTitle, techStack);
  }
};

export const evaluateAssignment = async (assignmentTitle: string, assignmentRequirements: string[], userSubmission: string): Promise<AssignmentFeedback> => {
    const ai = getClient();
    if (!ai) {
        await new Promise(r => setTimeout(r, 1500));
        return getMockEvaluation();
    }

    try {
        const prompt = `You are a friendly but strict coding tutor. Evaluate the user's submission for the assignment "${assignmentTitle}".
        
        Assignment Requirements:
        ${assignmentRequirements.map(r => `- ${r}`).join('\n')}

        User Submission:
        ${userSubmission}

        Provide structured feedback. If the submission is mostly correct and meets requirements, mark status as "Pass". If it is missing key requirements or has major errors, mark as "Needs Improvement".`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.STRING, enum: ["Pass", "Needs Improvement"] },
                        feedback: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["status", "feedback", "strengths", "improvements"]
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("Empty evaluation response");
        return JSON.parse(text) as AssignmentFeedback;

    } catch (error) {
        console.error("Error evaluating assignment:", error);
        return getMockEvaluation();
    }
}

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