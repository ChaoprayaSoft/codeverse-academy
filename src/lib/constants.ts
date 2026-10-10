import { CourseMeta } from '@/types';

export const CLIENT_ID = '1049203742621-85p09ruvq6kr2m1bnu1kg933ajhbjen3.apps.googleusercontent.com';

export const SUPER_ADMINS: string[] = ['tiawongsombat@gmail.com'];

export const COURSES: CourseMeta[] = [
  {
    key: 'explorer',
    title: 'Explorer Academy',
    shortName: 'Explorer',
    age: 'Ages 5-8',
    icon: '🚀',
    color: '#38bdf8',
    description: 'Logic puzzles and visual block-based coding. Perfect for early learners.',
    features: ['Sequential Thinking', 'Loop-Based Efficiency', 'Pattern Recognition', 'Basic Problem Solving'],
    totalLevels: 5,
    levelReward: 20,
    courseReward: 250,
  },
  {
    key: 'navigator',
    title: 'Navigator Terminal',
    shortName: 'Navigator',
    age: 'Ages 9-12',
    icon: '🛰️',
    color: '#22d3ee',
    description: 'Dive into spaceship game mechanics and interactive storytelling using Python scripting.',
    features: ['Python Foundations', 'Game Physics Engine', 'Creative CSS Animation', 'Computational Logic'],
    totalLevels: 6,
    levelReward: 25,
    courseReward: 500,
  },
  {
    key: 'commander',
    title: 'Commander IDE',
    shortName: 'Commander',
    age: 'Ages 13-15',
    icon: '🛸',
    color: '#818cf8',
    description: 'Professional multi-tab tools and real-world projects. Build apps, APIs, and AI.',
    features: ['Fullstack Web Dev', 'OpenCV Vision Tech', 'AI & Data Science', '3D Game Engines'],
    totalLevels: 5,
    levelReward: 30,
    courseReward: 400,
  },
  {
    key: 'architect',
    title: 'Architect Systems',
    shortName: 'Architect',
    age: 'Ages 15+',
    icon: '🌌',
    color: '#06b6d4',
    description: 'Master system design and high-level engineering. From Python architecture to microservices.',
    features: ['Advanced System Logic', 'Python Core Architecture', 'API & Server Design', 'Machine Learning Ops'],
    totalLevels: 12,
    levelReward: 40,
    courseReward: 500,
  },
  {
    key: 'data_analytic',
    title: 'Data Analytics',
    shortName: 'Data Analytic',
    age: 'Ages 15+',
    icon: '📊',
    color: '#f59e0b',
    description: 'Panda Analytics! Learn to process data sets, filter arrays, and create visualizations.',
    features: ['Intro to Datasets', 'Visualizing Trends', 'Array Manipulation', 'Data Logic Basics'],
    totalLevels: 10,
    levelReward: 20,
    courseReward: 300,
  },
  {
    key: 'ai_ml',
    title: 'AI & Machine Learning',
    shortName: 'AI & ML',
    age: 'Ages 15+',
    icon: '🧠',
    color: '#a78bfa',
    description: 'Explore Artificial Intelligence. Learn how machines learn and build intelligent models.',
    features: ['Neural Networks', 'Natural Language Processing', 'Computer Vision', 'Model Optimization'],
    totalLevels: 20,
    levelReward: 15,
    courseReward: 500,
  },
  {
    key: 'vision',
    title: 'Computer Vision',
    shortName: 'Vision',
    age: 'Ages 15+',
    icon: '🖥️',
    color: '#0ea5e9',
    description: 'See the world through code. Master image processing and object detection using OpenCV fundamentals.',
    features: ['Fundamental Filters', 'Edge & Shape Detection', 'Color Spaces (RGB/HSV)', 'Image Transformation'],
    totalLevels: 15,
    levelReward: 50,
    courseReward: 250,
  },
  {
    key: 'prompt_eng',
    title: 'Prompt Engineering',
    shortName: 'Prompt Eng',
    age: 'Ages 15+',
    icon: '💬',
    color: '#ec4899',
    description: 'Master the art of communicating with AI. Learn to design precise and powerful prompts.',
    features: ['Role & Persona Design', 'Shot-Based Learning', 'Chain of Thought Logic', 'Guardrails & Security'],
    totalLevels: 10,
    levelReward: 30,
    courseReward: 500,
  },
  {
    key: 'robotics',
    title: 'Fundamental of Robot',
    shortName: 'Robotics',
    age: 'Ages 15+',
    icon: '🤖',
    color: '#ef4444',
    description: 'Step into the robotics lab. Learn about sensors, actuators, and how to build intelligent machines.',
    features: ['Robot Anatomy & Components', 'Sensor Data Processing', 'Movement & Actuation', 'Autonomous System Logic'],
    totalLevels: 20,
    levelReward: 50,
    courseReward: 500,
  },
];

export const DEFAULT_PROGRESS = {
  xp: 0,
  missions: {
    explorer: false,
    navigator: false,
    commander: false,
    architect: false,
    data_analytic: false,
    ai_ml: false,
    vision: false,
    prompt_eng: false,
    robotics: false,
  },
  levels: {
    explorer: 1,
    navigator: 1,
    commander: 1,
    architect: 1,
    data_analytic: 1,
    ai_ml: 1,
    vision: 1,
    prompt_eng: 1,
    robotics: 1,
  },
  badges: [],
};

export const ANIMAL_AVATARS = [
  'Lion', 'Tiger', 'Bear', 'Eagle', 'Wolf', 'Fox', 'Dragon',
  'Panda', 'Koala', 'Falcon', 'Shark', 'Cheetah', 'Owl', 'Octopus'
];

export function getCadetRank(xp: number): string {
  if (xp >= 35000) return 'Space Legend';
  if (xp >= 20000) return 'Architect';
  if (xp >= 10000) return 'Commander';
  if (xp >= 5000) return 'Navigator';
  if (xp >= 2000) return 'Explorer';
  return 'Novice';
}

export function getNextRankTarget(xp: number): { nextRank: string; targetXp: number; percent: number } {
  if (xp >= 35000) return { nextRank: 'Max Rank', targetXp: 35000, percent: 100 };
  if (xp >= 20000) {
    const p = Math.min(100, Math.round(((xp - 20000) / (35000 - 20000)) * 100));
    return { nextRank: 'Space Legend', targetXp: 35000, percent: p };
  }
  if (xp >= 10000) {
    const p = Math.min(100, Math.round(((xp - 10000) / (20000 - 10000)) * 100));
    return { nextRank: 'Architect', targetXp: 20000, percent: p };
  }
  if (xp >= 5000) {
    const p = Math.min(100, Math.round(((xp - 5000) / (10000 - 5000)) * 100));
    return { nextRank: 'Commander', targetXp: 10000, percent: p };
  }
  if (xp >= 2000) {
    const p = Math.min(100, Math.round(((xp - 2000) / (5000 - 2000)) * 100));
    return { nextRank: 'Navigator', targetXp: 5000, percent: p };
  }
  const p = Math.min(100, Math.round((xp / 2000) * 100));
  return { nextRank: 'Explorer', targetXp: 2000, percent: p };
}
