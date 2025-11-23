
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
    description: `(Offline Mode) ${name} is a pivotal area in modern technology. This generated content mimics a live AI response. It encompasses the study of algorithms, data patterns, and computational models designed to solve complex problems within the domain of ${name}.`,
    subtopics: ['Core Fundamentals', 'Advanced Algorithms', 'Industry Applications', 'Ethics & Safety', 'Future Directions'],
    relatedFields: ['Computer Science', 'Data Engineering', 'Mathematics', 'Statistics']
});

const getMockLearningPath = (topic: string, difficulty: Difficulty, techStack?: string): LearningPath => ({
    id: `mock-path-${Date.now()}`,
    topic: topic,
    techStack: techStack || "General",
    difficulty: difficulty,
    modules: [
        {
            title: `Introduction to ${topic}`,
            description: `Foundational concepts and terminology for ${topic}.`,
            topics: ["Basics", "History", "Key Terms"],
            estimatedHours: 2,
            status: 'active'
        },
        {
            title: `Core Algorithms of ${topic}`,
            description: "Deep dive into the mathematical models and logic.",
            topics: ["Algorithms", "Math", "Optimization"],
            estimatedHours: 4,
            status: 'locked'
        },
        {
            title: `Applied ${topic} with ${techStack || 'Python'}`,
            description: "Building real-world applications using standard libraries.",
            topics: ["Coding", "Deployment", "Testing"],
            estimatedHours: 5,
            status: 'locked'
        },
        {
            title: "Advanced Techniques & Optimization",
            description: "Pushing the boundaries with state-of-the-art methods.",
            topics: ["Performance", "Scaling", "SOTA"],
            estimatedHours: 6,
            status: 'locked'
        },
        {
            title: "Capstone Project",
            description: "End-to-end implementation of a complex system.",
            topics: ["Project", "System Design"],
            estimatedHours: 10,
            status: 'locked'
        }
    ]
});

const getMockModuleContent = (title: string, techStack?: string): ModuleContent => ({
    overview: `This is an offline placeholder tutorial for "${title}". In a fully connected mode, Gemini would generate a comprehensive guide tailored to "${techStack || 'standard tools'}". This module covers the essential theory and practice required to master the subject.`,
    sections: [
        {
            title: "1. Understanding the Core Concepts",
            content: `To master "${title}", one must first grasp the underlying principles. \n\nKey Concept A: The standard approach involves analyzing data distribution. \n\nKey Concept B: Optimization is achieved through iterative refinement. \n\nThis theoretical framework allows for robust implementations in ${techStack || 'modern environments'}.`
        },
        {
            title: "2. Setting Up the Environment",
            content: `Before coding, ensure your environment is ready. \n\nInstall necessary packages:\n\`pip install ${techStack ? techStack.toLowerCase().split(' ')[0] : 'numpy pandas'}\`\n\nProper configuration is 90% of the battle in AI development.`
        },
        {
            title: "3. Implementation Steps",
            content: "We will now build a basic prototype. \n\nStep 1: Initialize your model parameters. \nStep 2: Load your dataset. \nStep 3: Run the training loop. \n\nObserve how the loss function decreases over time, indicating successful learning."
        }
    ],
    codeExample: {
        language: "python",
        code: `import ${techStack ? techStack.toLowerCase().split(' ')[0] : 'numpy'} as lib\n\ndef run_analysis(data):\n    # Initializing the ${title} model\n    print(f"Starting analysis on {len(data)} items...")\n    \n    # Placeholder logic for ${techStack || 'AI'} \n    result = lib.array([0.1, 0.5, 0.9])\n    \n    return result\n\n# Execute\ndata = [1, 2, 3, 4, 5]\nprint(run_analysis(data))`,
        explanation: `This snippet demonstrates how to structure a basic function for ${title} using ${techStack || 'Python'}. Note the initialization and execution flow.`
    },
    quizzes: [
        {
            question: `What is the primary focus of "${title}"?`,
            options: [
                "To confuse the user",
                "To build a foundational understanding of the topic",
                "To delete all data",
                "To mine cryptocurrency"
            ],
            correctAnswer: 1,
            explanation: "This module focuses on building core knowledge and practical skills."
        },
        {
            question: `Which library was recommended for ${techStack || 'this topic'}?`,
            options: ["jQuery", techStack || "NumPy", "React", "Laravel"],
            correctAnswer: 1,
            explanation: `${techStack || 'NumPy'} is the standard tool for this domain.`
        },
        {
            question: "Why is environment setup important?",
            options: ["It looks cool", "It prevents dependency conflicts", "It consumes more RAM", "It is optional"],
            correctAnswer: 1,
            explanation: "Proper setup ensures reproducibility and prevents version mismatches."
        }
    ],
    assignment: {
        title: "Build a Prototype",
        description: `Create a functional script that implements the core concepts of ${title} using ${techStack || 'Python'}.`,
        requirements: [
            "Import the required libraries",
            "Define a class or function for the main logic",
            "Process a sample dataset",
            "Output the final accuracy or result"
        ],
        difficulty: "Intermediate"
    }
});

const getMockResources = (category: string): ResourceItem[] => [
    {
        id: `mock-res-1-${Date.now()}`,
        title: `The Definitive Guide to ${category}`,
        author: 'AI Research Team',
        type: ResourceType.Book,
        url: '#',
        description: `A deep dive into ${category} featuring modern techniques and case studies.`,
        tags: ['Advanced', 'Theory']
    },
    {
        id: `mock-res-2-${Date.now()}`,
        title: `${category} for Practitioners`,
        author: 'Jane Engineer',
        type: ResourceType.Course,
        url: '#',
        description: 'Video lectures covering end-to-end implementation details.',
        tags: ['Practical', 'Video']
    },
    {
        id: `mock-res-3-${Date.now()}`,
        title: `Interactive ${category} Visualizer`,
        author: 'Tech Labs',
        type: ResourceType.Tool,
        url: '#',
        description: 'A browser-based tool to visualize the algorithms in real-time.',
        tags: ['Tool', 'Visualization']
    }
];

const getMockEvaluation = (): AssignmentFeedback => ({
    status: 'Pass',
    feedback: "Excellent attempt! Your logic is sound and follows the standard patterns for this type of problem. The mock evaluator is impressed.",
    strengths: ["Clear variable naming", "Logical flow", "Correct library usage"],
    improvements: ["Add more comments", "Consider edge cases with empty data"]
});

// --- API Functions ---

export const generateLearningPath = async (topic: string, difficulty: Difficulty, techStack?: string): Promise<LearningPath | null> => {
  const ai = getClient();
  if (!ai) {
      console.log("API Key missing, using mock data for Learning Path");
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
    if (techStack && !data.techStack) data.techStack = techStack;
    return data;

  } catch (error) {
    console.error("Error generating learning path (Switching to Mock):", error);
    return getMockLearningPath(topic, difficulty, techStack);
  }
};

export const generateModuleContent = async (topic: string, moduleTitle: string, difficulty: string, techStack?: string): Promise<ModuleContent | null> => {
  const ai = getClient();
  if (!ai) {
      await new Promise(r => setTimeout(r, 1500));
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
    5. A "Practical Assignment" challenge.`;

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
                    correctAnswer: { type: Type.INTEGER },
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
    console.error("Error generating module content (Switching to Mock):", error);
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
        const prompt = `Evaluate the user's submission for "${assignmentTitle}".
        Requirements: ${assignmentRequirements.join(', ')}.
        Submission: ${userSubmission}`;

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
        console.error("Error evaluating assignment (Switching to Mock):", error);
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
      contents: `Recommend 5 AI resources for: "${category}".`,
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
    console.error("Error generating resources (Switching to Mock):", error);
    return getMockResources(category);
  }
};

export const generateTopicOverview = async (topicName: string): Promise<TopicNode | null> => {
  const ai = getClient();
  if (!ai) {
      await new Promise(r => setTimeout(r, 800));
      return getMockTopic(topicName);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the AI topic '${topicName}'. Provide description, subtopics, and related fields.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            subtopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            relatedFields: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "description", "subtopics", "relatedFields"]
        }
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as TopicNode;
  } catch (error) {
    console.error("Error exploring topic (Switching to Mock):", error);
    return getMockTopic(topicName);
  }
};
