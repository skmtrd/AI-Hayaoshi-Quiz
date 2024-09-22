import { z } from 'zod';

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['WAITING', 'PLAYING', 'FINISHED']),
  currentSolverId: z.string().nullable(),
  inviteId: z.string(),
  category: z.string().nullable(),
  difficulty: z.number().nullable(),
  anserTimeLimit: z.number().nullable(),
  thinkingTimeLimit: z.number().nullable(),
  currentQuestionId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RoomWithResultsSchema = RoomSchema.extend({
  results: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      roomId: z.string(),
      questionId: z.string(),
      answer: z.string(),
      isCorrect: z.boolean(),
      time: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

export const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  comment: z.string(),
  roomId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SolverSchema = z.object({
  id: z.string(),
  isCorrect: z.boolean(),
  userId: z.string(),
  questionId: z.string(),
  answer: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ResultSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  userId: z.string(),
  ratingDelta: z.number().nullable().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});
