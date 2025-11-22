
export enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced"
}

export enum ResourceType {
  Book = "Book",
  Course = "Course",
  Paper = "Paper",
  Tool = "Tool"
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  xp: number;
  streak: number;
  interests: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  author: string;
  type: ResourceType;
  url: string;
  description: string;
  tags: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

export interface ModuleContent {
  overview: string;
  sections: { title: string; content: string }[];
  codeExample?: CodeExample;
  quiz?: QuizQuestion;
}

export interface LearningModule {
  title: string;
  description: string;
  topics: string[];
  estimatedHours: number;
  status?: 'locked' | 'active' | 'completed';
  content?: ModuleContent; // Populated on demand
}

export interface LearningPath {
  id: string;
  topic: string;
  difficulty: Difficulty;
  modules: LearningModule[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface TopicNode {
  name: string;
  description: string;
  subtopics: string[];
  relatedFields: string[];
}
