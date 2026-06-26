export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';
export type ExerciseStatus = 'pending' | 'approved' | 'rejected';
export type AiMode = 'local' | 'online';

export interface AcademyCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  format: string;
  statusLabel: string;
  modules: AcademyModule[];
}

export interface AcademyModule {
  id: string;
  slug: string;
  title: string;
  order: number;
  lessons: AcademyLesson[];
}

export interface AcademyLesson {
  id: string;
  slug: string;
  moduleId: string;
  order: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  status: LessonStatus;
  objectives: string[];
  theory: string;
  guidedExample: string;
  commonMistakes: string[];
  localPractice: string;
  forgeMission: string;
  approvalCriteria: ValidationCriterion[];
  exercises: AcademyExercise[];
}

export interface AcademyExercise {
  id: string;
  slug: string;
  lessonId: string;
  title: string;
  description: string;
  type: 'local_code' | 'written_explanation' | 'mixed';
  required: boolean;
  status: ExerciseStatus;
  instructions: string[];
  expectedEvidence: string[];
  validationCriteria: ValidationCriterion[];
  attempts: ExerciseAttempt[];
}

export interface ValidationCriterion {
  id: string;
  description: string;
  required: boolean;
}

export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  status: ExerciseStatus;
  score: number;
  feedback: string;
  createdAt: string;
  forgeSessionId: string;
}

export interface StudentDashboard {
  studentId: string;
  studentName: string;
  currentCourseSlug: string;
  currentLessonSlug: string;
  aiMode: AiMode;
  tokenBalance: number;
}

export interface ForgeValidationResult {
  courseId: string;
  lessonId: string;
  exerciseId: string;
  status: 'approved' | 'rejected';
  score: number;
  feedback: string;
  checks: Array<{
    id: string;
    status: 'passed' | 'failed';
    message: string;
  }>;
  forgeSessionId: string;
}

export interface ForgeLog {
  id: string;
  message: string;
  createdAt: string;
  mode: AiMode;
  status: 'info' | 'success' | 'warning';
}

export interface TokenTransaction {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
}
