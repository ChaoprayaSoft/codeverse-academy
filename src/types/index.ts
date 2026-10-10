export type UserRole = 'Admin' | 'Teacher' | 'Student' | 'Guest';

export interface UserProfile {
  email: string;
  name: string;
  avatar: string;
  color?: string;
  role: UserRole | null;
  lastUpdated?: string;
  status?: string;
}

export interface UserProgress {
  xp: number;
  levels: Record<string, number>;
  missions: Record<string, boolean>;
  badges: string[];
}

export interface CourseReward {
  level: number;
  course: number;
  totalLevels: number;
}

export interface CourseMeta {
  key: string;
  title: string;
  shortName: string;
  age: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
  totalLevels: number;
  levelReward: number;
  courseReward: number;
}

export interface CadetUserData extends UserProfile {
  progress?: UserProgress;
}
